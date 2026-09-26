import hashlib
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import CustodyEvent, Document

ledger_router = APIRouter()


def record_custody_event(
    db: Session,
    event_type: str,
    actor_id: int,
    actor_role: str,
    document_id: int,
    version_id: int,
    metadata: Optional[dict] = None,
) -> CustodyEvent:
    latest_event = (
        db.query(CustodyEvent)
        .filter(CustodyEvent.sequence_no.isnot(None))
        .order_by(CustodyEvent.sequence_no.desc())
        .first()
    )
    sequence_no = latest_event.sequence_no + 1 if latest_event else 1
    previous_event_hash = latest_event.event_hash if latest_event else "GENESIS"
    timestamp_utc = datetime.now(timezone.utc).replace(tzinfo=None)
    document = db.query(Document).filter(Document.id == document_id).first()

    event_hash = hashlib.sha256(
        (
            f"{sequence_no}{event_type}{actor_id}"
            f"{timestamp_utc}{previous_event_hash}"
        ).encode("utf-8")
    ).hexdigest()

    event = CustodyEvent(
        case_id=document.case_id if document else None,
        event_type=event_type,
        actor_id=actor_id,
        actor_role=actor_role,
        document_id=document_id,
        version_id=version_id,
        timestamp_utc=timestamp_utc,
        created_at=timestamp_utc,
        sequence_no=sequence_no,
        previous_event_hash=previous_event_hash,
        event_hash=event_hash,
        event_metadata=metadata,
    )
    db.add(event)
    db.flush()
    return event


@ledger_router.get("/documents/{document_id}/custody-chain")
def get_custody_chain(document_id: int, db: Session = Depends(get_db)):
    return (
        db.query(CustodyEvent)
        .filter(CustodyEvent.document_id == document_id)
        .order_by(CustodyEvent.sequence_no.asc())
        .all()
    )
