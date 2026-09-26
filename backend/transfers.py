from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from ledger import record_custody_event
from models import Document, DocumentVersion, Transfer, User

transfers_router = APIRouter()


class TransferRequest(BaseModel):
    document_id: int
    version_id: int
    requested_to: int


class TransferApproval(BaseModel):
    approved: bool


def get_current_user(
    x_user_id: int = Header(..., alias="X-User-ID"),
    db: Session = Depends(get_db),
) -> User:
    user = db.query(User).filter(User.id == x_user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Current user not found")
    return user


def _transfer_data(transfer: Transfer) -> dict:
    return {
        "id": transfer.id,
        "document_id": transfer.document_id,
        "version_id": transfer.version_id,
        "requested_by": transfer.requested_by,
        "requested_to": transfer.requested_to,
        "status": transfer.status,
        "approved_by": transfer.approved_by,
        "created_at": transfer.created_at,
    }


@transfers_router.post("/transfers/request")
def request_transfer(
    request: TransferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_user = db.query(User).filter(User.id == request.requested_to).first()
    if target_user is None:
        raise HTTPException(status_code=404, detail="Target user not found")

    document = (
        db.query(Document).filter(Document.id == request.document_id).first()
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    version = (
        db.query(DocumentVersion)
        .filter(
            DocumentVersion.id == request.version_id,
            DocumentVersion.document_id == request.document_id,
        )
        .first()
    )
    if version is None:
        raise HTTPException(
            status_code=404, detail="Document version not found"
        )

    transfer = Transfer(
        document_id=request.document_id,
        version_id=request.version_id,
        requested_by=current_user.id,
        requested_to=target_user.id,
        status="PENDING",
    )
    db.add(transfer)
    db.flush()

    record_custody_event(
        db,
        event_type="TRANSFER_REQUESTED",
        actor_id=current_user.id,
        actor_role=current_user.role,
        document_id=document.id,
        version_id=version.id,
        metadata={"transfer_id": transfer.id, "requested_to": target_user.id},
    )
    db.commit()
    db.refresh(transfer)
    return _transfer_data(transfer)


@transfers_router.post("/transfers/{transfer_id}/approve")
def approve_transfer(
    transfer_id: int,
    approval: TransferApproval,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transfer = db.query(Transfer).filter(Transfer.id == transfer_id).first()
    if transfer is None:
        raise HTTPException(status_code=404, detail="Transfer not found")
    if transfer.status != "PENDING":
        raise HTTPException(
            status_code=409, detail="Transfer is no longer pending"
        )

    transfer.status = "APPROVED" if approval.approved else "REJECTED"
    transfer.approved_by = current_user.id

    record_custody_event(
        db,
        event_type=(
            "TRANSFER_APPROVED" if approval.approved else "TRANSFER_REJECTED"
        ),
        actor_id=current_user.id,
        actor_role=current_user.role,
        document_id=transfer.document_id,
        version_id=transfer.version_id,
        metadata={"transfer_id": transfer.id},
    )
    db.commit()
    db.refresh(transfer)
    return _transfer_data(transfer)


@transfers_router.get("/transfers/pending")
def get_pending_transfers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transfers = (
        db.query(Transfer)
        .filter(
            Transfer.status == "PENDING",
            Transfer.requested_to == current_user.id,
        )
        .order_by(Transfer.id.asc())
        .all()
    )
    return [_transfer_data(transfer) for transfer in transfers]
