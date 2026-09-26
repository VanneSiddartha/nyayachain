import { Role, User } from '../types';

export type PermissionAction =
  | 'upload'
  | 'create_version'
  | 'request_transfer'
  | 'approve_transfer'
  | 'reject_transfer'
  | 'revoke_transfer'
  | 'verify'
  | 'download'
  | 'review_alert'
  | 'audit_access';

export function can(user: User | null, action: PermissionAction, resource?: string): boolean {
  if (!user) return false;

  const role = user.role;

  if (action === 'audit_access') {
    return role === 'auditor' || role === 'supervisory_officer' || role === 'investigating_officer';
  }

  const roleRules: Record<Role, PermissionAction[]> = {
    investigating_officer: [
      'upload',
      'create_version',
      'request_transfer',
      'verify',
      'download',
    ],
    supervisory_officer: ['approve_transfer', 'reject_transfer', 'revoke_transfer', 'review_alert', 'audit_access'],
    legal_reviewer: ['download', 'verify', 'audit_access'],
    auditor: ['audit_access'],
  };

  if (!roleRules[role].includes(action)) {
    return false;
  }

  if (action === 'download') {
    if (role === 'auditor') {
      return false;
    }
    return resource !== 'restricted';
  }

  if (action === 'verify') {
    return role === 'investigating_officer' || role === 'legal_reviewer' || role === 'supervisory_officer';
  }

  return true;
}

export function userDisplayRole(role: Role): string {
  const map: Record<Role, string> = {
    investigating_officer: 'Investigating Officer',
    supervisory_officer: 'Supervisory Officer',
    legal_reviewer: 'Legal Reviewer',
    auditor: 'Auditor',
  };

  return map[role];
}
