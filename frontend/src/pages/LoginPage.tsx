import React, { FormEvent, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { demoCredentials } from '../data/demoCredentials';
import { Role } from '../types';

const roleOptions: { value: Role; label: string }[] = [
  { value: 'investigating_officer', label: 'Investigating Officer' },
  { value: 'supervisory_officer', label: 'Supervisory Officer' },
  { value: 'legal_reviewer', label: 'Legal Reviewer' },
  { value: 'auditor', label: 'Auditor' },
];

export default function LoginPage() {
  const { users, isAuthenticated, signIn } = useAppContext();
  const [role, setRole] = useState<Role | ''>('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role || !name.trim() || !password) return;
    const credential = demoCredentials.find(
      (item) => item.role === role && item.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (!credential) {
      setError('Invalid role, name, or password.');
      return;
    }
    if (credential.password !== password) {
      setError('Invalid password');
      return;
    }

    const account = users.find((user) => user.role === role);
    const user = account ? await api.login(account.id) : null;
    if (!user) {
      setError('Unable to sign in with the selected demo user.');
      return;
    }

    signIn({ ...user, name: credential.name });
    navigate('/dashboard', { replace: true });
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-wide">NyayaChain</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Secure Evidence Ops</p>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-bold tracking-tight">NyayaChain Login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in with a demo account. These credentials are for prototype use only.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label htmlFor="demo-role" className="block text-sm font-medium text-slate-700">Role</label>
          <select
            id="demo-role"
            required
            value={role}
            onChange={(event) => {
              const selectedRole = roleOptions.find((option) => option.value === event.target.value);
              setRole(selectedRole?.value ?? '');
              setError('');
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>Select a role</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label htmlFor="demo-name" className="block text-sm font-medium text-slate-700">Name</label>
          <input
            id="demo-name"
            type="text"
            autoComplete="username"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <label htmlFor="demo-password" className="block text-sm font-medium text-slate-700">Password</label>
          <input
            id="demo-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}
