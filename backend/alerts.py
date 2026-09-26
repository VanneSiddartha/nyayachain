from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from ledger import record_custody_event
from models import DocumentVersion, IntegrityAlert

alerts_router = APIRouter()


class AlertResolution(BaseModel):
    action: Literal["RESOLVED", "DISMISSED"]
    notes: str = ""


@alerts_router.get("/alerts")
def list_alerts(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(IntegrityAlert)
    if status is not None:
        query = query.filter(IntegrityAlert.status == status)
    return query.order_by(IntegrityAlert.detected_at.desc()).all()


@alerts_router.post("/alerts/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    resolution: AlertResolution,
    db: Session = Depends(get_db),
):
    alert = (
        db.query(IntegrityAlert)
        .filter(IntegrityAlert.id == alert_id)
        .first()
    )
    if alert is None:
        raise HTTPException(status_code=404, detail="Integrity alert not found")

    alert.status = resolution.action
    version = None
    if alert.version_id is not None:
        version = (
            db.query(DocumentVersion)
            .filter(DocumentVersion.id == alert.version_id)
            .first()
        )

    if resolution.action == "RESOLVED" and version is not None:
        version.integrity_status = "VALID"

    record_custody_event(
        db,
        event_type="ALERT_RESOLVED",
        actor_id=0,
        actor_role="system",
        document_id=alert.document_id,
        version_id=alert.version_id,
        metadata={
            "alert_id": alert.id,
            "action": resolution.action,
            "notes": resolution.notes,
        },
    )
    db.commit()
    db.refresh(alert)
    return alert


@alerts_router.get("/alerts/restricted-documents")
def list_restricted_documents(db: Session = Depends(get_db)):
    return (
        db.query(DocumentVersion)
        .filter(DocumentVersion.integrity_status == "RESTRICTED")
        .order_by(DocumentVersion.id.asc())
        .all()
    )
