import { Role } from '../types';

export interface DemoCredential {
  role: Role;
  name: string;
  password: string;
}

export const demoCredentials: DemoCredential[] = [
  { role: 'investigating_officer', name: 'Ravi Kumar', password: 'Officer@123' },
  { role: 'supervisory_officer', name: 'Anil Sharma', password: 'Supervisor@123' },
  { role: 'legal_reviewer', name: 'Priya Reddy', password: 'Legal@123' },
  { role: 'auditor', name: 'Kiran Rao', password: 'Auditor@123' },
];
