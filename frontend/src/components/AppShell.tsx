import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <TopNavigation />
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
}
