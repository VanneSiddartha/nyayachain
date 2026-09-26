import { describe, expect, it } from 'vitest';
import { can, userDisplayRole } from '../utils/permissions';
import { users } from '../data/users';
import { createMockHash, validateFile } from '../utils/validation';

const io = users.find((user) => user.role === 'investigating_officer')!;
const supervisor = users.find((user) => user.role === 'supervisory_officer')!;
const reviewer = users.find((user) => user.role === 'legal_reviewer')!;
const auditor = users.find((user) => user.role === 'auditor')!;

describe('role permission utility', () => {
  it('IO cannot approve own transfer', () => {
    expect(can(io, 'approve_transfer')).toBe(false);
  });

  it('Legal Reviewer cannot access before approval', () => {
    expect(can(reviewer, 'download', 'restricted')).toBe(false);
  });

  it('Legal Reviewer cannot access restricted version', () => {
    expect(can(reviewer, 'download', 'restricted')).toBe(false);
  });

  it('Auditor cannot download binaries', () => {
    expect(can(auditor, 'download')).toBe(false);
  });

  it('Supervisor can approve/reject transfers', () => {
    expect(can(supervisor, 'approve_transfer')).toBe(true);
    expect(can(supervisor, 'reject_transfer')).toBe(true);
  });

  it('userDisplayRole returns friendly label', () => {
    expect(userDisplayRole('legal_reviewer')).toContain('Legal');
  });

  it('document validation rejects oversize upload', () => {
    const file = new File(['x'.repeat(26 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    expect(validateFile(file)).toBe('File exceeds the 25 MB limit.');
  });

  it('mock hash creation returns demo hash', () => {
    expect(createMockHash('V1').startsWith('mock-')).toBe(true);
  });
});
