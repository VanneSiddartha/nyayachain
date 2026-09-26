import { LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { userDisplayRole } from '../utils/permissions';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Cases', to: '/cases' },
  { label: 'Documents', to: '/documents' },
  { label: 'Transfers', to: '/transfers' },
  { label: 'Integrity', to: '/integrity' },
  { label: 'Audit', to: '/audit' },
];

export function TopNavigation() {
  const { activeUser, selectedUser, setSelectedUser, signOut, users } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-200 bg-navy-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-wide">NyayaChain</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Secure Evidence Ops</div>
          </div>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <select
            value={selectedUser.id}
            onChange={(event) => {
              const nextUser = users.find((user) => user.id === event.target.value);
              if (nextUser) setSelectedUser(nextUser);
            }}
            aria-label="Select demo role"
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 outline-none ring-0"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.id === activeUser.id ? activeUser.name : user.name} — {userDisplayRole(user.role)}
              </option>
            ))}
          </select>

          <div className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-sm md:flex">
            <UserCircle2 className="h-4 w-4 text-blue-300" />
            <span>{activeUser.name}</span>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate('/login', { replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
