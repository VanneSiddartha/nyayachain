from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password_hash = Column(String)
    role = Column(String) # investigating_officer, supervisory_officer, legal_reviewer, auditor
    full_name = Column(String)
    active = Column(Boolean, default=True)

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True)
    case_reference = Column(String, unique=True)
    title = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class CaseAssignment(Base):
    __tablename__ = "case_assignments"
    case_id = Column(Integer, ForeignKey("cases.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    title = Column(String)
    status = Column(String, default="active")
    current_version_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    version_number = Column(Integer)
    storage_key = Column(String)
    mime_type = Column(String)
    file_size = Column(Integer)
    plaintext_sha256 = Column(String) # SHA-256 Fingerprint
    integrity_status = Column(String, default="VALID")
    created_at = Column(DateTime, default=datetime.utcnow)

class CustodyEvent(Base):
    __tablename__ = "custody_events"
    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    version_id = Column(Integer, ForeignKey("document_versions.id"), nullable=True)
    event_type = Column(String)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    actor_id = Column(Integer, nullable=True)
    actor_role = Column(String, nullable=True)
    timestamp_utc = Column(DateTime(timezone=True), nullable=True)
    sequence_no = Column(Integer, nullable=True)
    previous_event_hash = Column(String, nullable=True)
    event_hash = Column(String, nullable=True)
    event_metadata = Column("metadata", JSON, nullable=True)

class Transfer(Base):
    __tablename__ = "transfers"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    version_id = Column(Integer, ForeignKey("document_versions.id"), nullable=False)
    requested_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    requested_to = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default="PENDING")
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class IntegrityAlert(Base):
    __tablename__ = "integrity_alerts"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    version_id = Column(Integer, ForeignKey("document_versions.id"), nullable=True)
    severity = Column(String, nullable=False)
    alert_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="OPEN")
    details = Column(Text, nullable=True)
    detected_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)