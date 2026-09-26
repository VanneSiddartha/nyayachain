import React from 'react';
import { useAppContext } from '../context/AppContext';
import { userDisplayRole } from '../utils/permissions';

export function RoleSwitcher() {
  const { users, selectedUser, setSelectedUser } = useAppContext();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Demo role</p>
          <h3 className="text-lg font-semibold text-slate-900">Choose a user</h3>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => setSelectedUser(user)}
            className={`rounded-xl border p-3 text-left transition ${
              selectedUser.id === user.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="font-semibold text-slate-900">{user.id === selectedUser.id ? selectedUser.name : user.name}</div>
            <div className="mt-1 text-sm text-slate-600">{userDisplayRole(user.role)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
