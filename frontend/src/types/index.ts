export type Role =
  | 'investigating_officer'
  | 'supervisory_officer'
  | 'legal_reviewer'
  | 'auditor';

export type CaseStatus = 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TransferStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
export type DocumentStatus = 'VALID' | 'RESTRICTED' | 'REVIEWED' | 'PENDING';
export type AlertStatus = 'OPEN' | 'RESOLVED';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  isPrimary?: boolean;
}

export interface NyayaCase {
  id: string;
  name: string;
  assignedOfficerIds: string[];
  priority: Priority;
  status: CaseStatus;
  secureFileCount: number;
  lastActivity: string;
  createdAt: string;
  summary: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: 'V1' | 'V2' | 'V3';
  status: DocumentStatus;
  sha256: string;
  uploadedBy: string;
  createdAt: string;
  storageKey: string;
  mimeType: string;
  fileName: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  caseId: string;
  currentVersion: string;
  integrityStatus: DocumentStatus;
  uploadedBy: string;
  lastUpdated: string;
  fileType: string;
  versions: DocumentVersion[];
  isSecure: boolean;
}

export interface Transfer {
  id: string;
  documentId: string;
  versionId: string;
  fromUserId: string;
  toUserId: string;
  reason: string;
  status: TransferStatus;
  createdAt: string;
}

export interface CustodyEvent {
  id: string;
  documentId: string;
  versionId: string;
  actorId: string;
  role: string;
  action: string;
  timestamp: string;
  status?: string;
  recipientId?: string;
  details?: string;
}

export interface IntegrityAlert {
  id: string;
  caseId: string;
  documentId: string;
  versionId: string;
  title: string;
  message: string;
  status: AlertStatus;
  createdAt: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface VerificationResult {
  id: string;
  documentId: string;
  versionId: string;
  passed: boolean;
  status: 'VALID' | 'RESTRICTED' | 'REVIEWED';
  verifiedAt: string;
  reason: string;
}
