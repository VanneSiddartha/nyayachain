import { User } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Ravi Kumar', role: 'investigating_officer', email: 'ravi.kumar@nyayachain.demo', isPrimary: true },
  { id: 'u2', name: 'Anita Sharma', role: 'supervisory_officer', email: 'anita.sharma@nyayachain.demo' },
  { id: 'u3', name: 'Priya Mehta', role: 'legal_reviewer', email: 'priya.mehta@nyayachain.demo' },
  { id: 'u4', name: 'Arjun Rao', role: 'auditor', email: 'arjun.rao@nyayachain.demo' },
];

export const demoUserId = 'u1';
