import { alerts } from '../data/alerts';
import { cases } from '../data/cases';
import { custodyEvents } from '../data/custodyEvents';
import { documents } from '../data/documents';
import { transfers } from '../data/transfers';
import { users } from '../data/users';
import { verificationResults } from '../data/verification';
import { CustodyEvent, DocumentItem, DocumentVersion, IntegrityAlert, NyayaCase, Transfer, User, VerificationResult } from '../types';

export type ApiResponse<T> = Promise<T>;

export const api = {
  async login(userId: string): Promise<User | null> {
    return users.find((user) => user.id === userId) ?? null;
  },

  async getCases(): Promise<NyayaCase[]> {
    return cases;
  },

  async getUsers(): Promise<User[]> {
    return users;
  },

  async uploadDocument(file: File): Promise<{ document: DocumentItem; version: DocumentVersion }> {
    const id = `doc-${Date.now()}`;
    const version: DocumentVersion = {
      id: `v-${Date.now()}`,
      documentId: id,
      version: 'V1',
      status: 'VALID',
      sha256: `mock-${file.name.slice(0, 8)}-${Math.random().toString(16).slice(2, 10)}`,
      uploadedBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      storageKey: `demo://${id}/V1/secure`,
      mimeType: file.type || 'application/octet-stream',
      fileName: file.name,
    };

    const document: DocumentItem = {
      id,
      name: file.name,
      caseId: 'HYD-CYB-2026-0147',
      type: 'Uploaded evidence',
      currentVersion: 'V1',
      integrityStatus: 'VALID',
      uploadedBy: 'Ravi Kumar',
      lastUpdated: new Date().toISOString(),
      fileType: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      versions: [version],
      isSecure: true,
    };

    return { document, version };
  },

  async createDocumentVersion(documentId: string): Promise<DocumentVersion> {
    const document = documents.find((item) => item.id === documentId) ?? documents[0];
    const nextVersion = document.versions.length + 1;
    const version: DocumentVersion = {
      id: `v-${Date.now()}`,
      documentId,
      version: `V${nextVersion}` as 'V1' | 'V2' | 'V3',
      status: 'VALID',
      sha256: `mock-${document.name.slice(0, 8)}-${Math.random().toString(16).slice(2, 10)}`,
      uploadedBy: 'Ravi Kumar',
      createdAt: new Date().toISOString(),
      storageKey: `demo://${documentId}/V${nextVersion}/secure`,
      mimeType: 'application/pdf',
      fileName: document.name,
    };
    return version;
  },

  async getDocumentContent(documentId: string, versionId: string): Promise<{ access: 'granted' | 'denied'; content?: string }> {
    const doc = documents.find((item) => item.id === documentId);
    const version = doc?.versions.find((entry) => entry.id === versionId);
    if (!doc || !version) return { access: 'denied' };
    return { access: version.status === 'RESTRICTED' ? 'denied' : 'granted', content: `Mock content for ${doc.name} (${version.version})` };
  },

  async createTransfer(payload: Omit<Transfer, 'id' | 'status' | 'createdAt'>): Promise<Transfer> {
    const transfer: Transfer = {
      id: `t-${Date.now()}`,
      ...payload,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    transfers.push(transfer);
    return transfer;
  },

  async decideTransfer(id: string, decision: 'APPROVED' | 'REJECTED' | 'REVOKED'): Promise<Transfer> {
    const transfer = transfers.find((item) => item.id === id);
    if (!transfer) throw new Error('Transfer not found');
    transfer.status = decision;
    return transfer;
  },

  async revokeTransfer(id: string): Promise<Transfer> {
    return this.decideTransfer(id, 'REVOKED');
  },

  async getCustody(documentId: string): Promise<CustodyEvent[]> {
    return custodyEvents.filter((item) => item.documentId === documentId);
  },

  async verifyVersion(documentId: string, versionId: string): Promise<VerificationResult> {
    const result: VerificationResult = {
      id: `vr-${Date.now()}`,
      documentId,
      versionId,
      passed: false,
      status: 'RESTRICTED',
      verifiedAt: new Date().toISOString(),
      reason: 'SHA-256 mismatch',
    };
    verificationResults.push(result);
    return result;
  },

  async getAlerts(): Promise<IntegrityAlert[]> {
    return alerts;
  },

  async reviewIntegrityAlert(alertId: string): Promise<IntegrityAlert> {
    const alert = alerts.find((item) => item.id === alertId);
    if (!alert) throw new Error('Alert not found');
    alert.status = 'RESOLVED';
    return alert;
  },

  async simulateTamper(documentId: string, versionId: string): Promise<{ status: 'RESTRICTED'; alert: IntegrityAlert; verified: VerificationResult }> {
    const alert: IntegrityAlert = {
      id: `alert-${Date.now()}`,
      caseId: 'HYD-CYB-2026-0147',
      documentId,
      versionId,
      title: 'Integrity verification failed',
      message: 'Hash mismatch detected',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      severity: 'HIGH',
    };
    const verified: VerificationResult = {
      id: `vr-${Date.now()}`,
      documentId,
      versionId,
      passed: false,
      status: 'RESTRICTED',
      verifiedAt: new Date().toISOString(),
      reason: 'SHA-256 mismatch',
    };
    alerts.push(alert);
    verificationResults.push(verified);
    return { status: 'RESTRICTED', alert, verified };
  },
};
