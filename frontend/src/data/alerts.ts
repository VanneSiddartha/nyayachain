import { IntegrityAlert } from '../types';

export const alerts: IntegrityAlert[] = [
  {
    id: 'alert-1',
    caseId: 'HYD-CYB-2026-0147',
    documentId: 'doc-1',
    versionId: 'v-1',
    title: 'Evidence_Statement_04.pdf',
    message: 'Hash mismatch detected',
    status: 'OPEN',
    createdAt: '2026-09-26T10:25:00Z',
    severity: 'HIGH',
  },
  {
    id: 'alert-2',
    caseId: 'HYD-CYB-2026-0182',
    documentId: 'doc-3',
    versionId: 'v-4',
    title: 'Transaction anomaly',
    message: 'Review needed for downstream integrity check.',
    status: 'RESOLVED',
    createdAt: '2026-09-24T06:00:00Z',
    severity: 'MEDIUM',
  },
];
