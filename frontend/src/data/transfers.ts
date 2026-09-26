import { Transfer } from '../types';

export const transfers: Transfer[] = [
  {
    id: 't-1',
    documentId: 'doc-1',
    versionId: 'v-1',
    fromUserId: 'u1',
    toUserId: 'u3',
    reason: 'Legal review of forensic evidence before hearing preparation.',
    status: 'PENDING',
    createdAt: '2026-09-26T10:00:00Z',
  },
  {
    id: 't-2',
    documentId: 'doc-2',
    versionId: 'v-3',
    fromUserId: 'u1',
    toUserId: 'u2',
    reason: 'Supervisory validation of statement integrity.',
    status: 'APPROVED',
    createdAt: '2026-09-24T11:20:00Z',
  },
  {
    id: 't-3',
    documentId: 'doc-3',
    versionId: 'v-4',
    fromUserId: 'u1',
    toUserId: 'u3',
    reason: 'Document review for evidentiary analysis.',
    status: 'REJECTED',
    createdAt: '2026-09-22T12:05:00Z',
  },
];
