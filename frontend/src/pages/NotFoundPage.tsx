import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-soft">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">This page does not exist in the NyayaChain prototype.</p>
      <Link to="/dashboard" className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
        Go to dashboard
      </Link>
    </div>
  );
}
