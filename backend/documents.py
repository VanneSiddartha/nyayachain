import hashlib
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from ledger import record_custody_event
from models import Case, Document, DocumentVersion

router = APIRouter()

STORAGE_DIR = Path(__file__).resolve().parent / "storage"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/cases/{case_id}/documents/upload")
async def upload_document(
    case_id: int,
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    fingerprint = hashlib.sha256(contents).hexdigest()
    ext = Path(file.filename or "").suffix
    storage_key = f"{uuid.uuid4()}{ext}"
    dest_path = STORAGE_DIR / storage_key
    dest_path.write_bytes(contents)

    document = Document(case_id=case_id, title=title, status="active")
    db.add(document)
    db.flush()

    version = DocumentVersion(
        document_id=document.id,
        version_number=1,
        storage_key=storage_key,
        mime_type=file.content_type,
        file_size=len(contents),
        plaintext_sha256=fingerprint,
        integrity_status="VALID",
    )
    db.add(version)
    db.flush()

    document.current_version_id = version.id

    record_custody_event(
        db,
        event_type="DOCUMENT_INGESTED",
        actor_id=0,
        actor_role="system",
        document_id=document.id,
        version_id=version.id,
        metadata={
            "case_id": case_id,
            "details": f"Document '{title}' ingested as version 1",
        },
    )
    db.commit()
    db.refresh(document)
    db.refresh(version)

    return {
        "document_id": document.id,
        "case_id": document.case_id,
        "title": document.title,
        "status": document.status,
        "current_version_id": document.current_version_id,
        "version_number": version.version_number,
        "storage_key": version.storage_key,
        "mime_type": version.mime_type,
        "file_size": version.file_size,
        "plaintext_sha256": fingerprint,
        "integrity_status": version.integrity_status,
    }
