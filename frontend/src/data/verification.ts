import { VerificationResult } from '../types';

export const verificationResults: VerificationResult[] = [
  {
    id: 'vr-1',
    documentId: 'doc-1',
    versionId: 'v-1',
    passed: true,
    status: 'VALID',
    verifiedAt: '2026-09-25T10:50:00Z',
    reason: 'SHA-256 hash matched expected chain index.',
  },
  {
    id: 'vr-2',
    documentId: 'doc-1',
    versionId: 'v-1',
    passed: false,
    status: 'RESTRICTED',
    verifiedAt: '2026-09-26T10:25:00Z',
    reason: 'SHA-256 mismatch',
  },
  {
    id: 'vr-3',
    documentId: 'doc-2',
    versionId: 'v-3',
    passed: true,
    status: 'VALID',
    verifiedAt: '2026-09-23T12:00:00Z',
    reason: 'Hash verification passed for approved evidence statement.',
  },
];
