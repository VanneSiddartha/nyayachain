import hashlib
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from ledger import record_custody_event
from models import CustodyEvent, Document, DocumentVersion, IntegrityAlert

verify_router = APIRouter()
STORAGE_DIR = Path(__file__).resolve().parent / "storage"


def _create_integrity_alert(
    db: Session,
    alert_type: str,
    document_id: Optional[int],
    version_id: Optional[int],
    details: str,
) -> None:
    db.add(
        IntegrityAlert(
            document_id=document_id,
            version_id=version_id,
            severity="HIGH",
            alert_type=alert_type,
            status="OPEN",
            details=details,
        )
    )


@verify_router.post("/verify/document/{version_id}")
def verify_document(version_id: int, db: Session = Depends(get_db)):
    version = (
        db.query(DocumentVersion)
        .filter(DocumentVersion.id == version_id)
        .first()
    )
    if version is None:
        raise HTTPException(status_code=404, detail="Document version not found")

    storage_root = STORAGE_DIR.resolve()
    file_path = (storage_root / version.storage_key).resolve()
    if file_path.parent != storage_root or not file_path.is_file():
        live_hash = None
    else:
        live_hash = hashlib.sha256(file_path.read_bytes()).hexdigest()

    if live_hash != version.plaintext_sha256:
        version.integrity_status = "RESTRICTED"
        _create_integrity_alert(
            db,
            alert_type="FILE_MISMATCH",
            document_id=version.document_id,
            version_id=version.id,
            details="Stored document file is missing or its SHA-256 hash does not match.",
        )
        record_custody_event(
            db,
            event_type="TAMPER_DETECTED",
            actor_id=0,
            actor_role="system",
            document_id=version.document_id,
            version_id=version.id,
            metadata={"alert_type": "FILE_MISMATCH"},
        )
        db.commit()
        return {
            "status": "TAMPERED",
            "detail": "File hash mismatch detected!",
            "integrity_status": "RESTRICTED",
        }

    version.integrity_status = "VALID"
    db.commit()
    return {
        "status": "VALID",
        "detail": "File integrity verified.",
        "integrity_status": "VALID",
    }


@verify_router.post("/verify/ledger/{document_id}")
def verify_ledger(document_id: int, db: Session = Depends(get_db)):
    events = (
        db.query(CustodyEvent)
        .filter(CustodyEvent.document_id == document_id)
        .order_by(CustodyEvent.sequence_no.asc())
        .all()
    )

    previous_event_hash = "GENESIS"
    for event in events:
        calculated_hash = hashlib.sha256(
            (
                f"{event.sequence_no}{event.event_type}{event.actor_id}"
                f"{event.timestamp_utc}{event.previous_event_hash}"
            ).encode("utf-8")
        ).hexdigest()
        if (
            event.previous_event_hash != previous_event_hash
            or event.event_hash != calculated_hash
        ):
            _create_integrity_alert(
                db,
                alert_type="LEDGER_BROKEN",
                document_id=document_id,
                version_id=event.version_id,
                details=f"Ledger validation failed at sequence {event.sequence_no}.",
            )
            db.commit()
            return {
                "status": "BROKEN",
                "failed_at_sequence": event.sequence_no,
            }
        previous_event_hash = event.event_hash

    return {"status": "INTACT", "total_events": len(events)}
