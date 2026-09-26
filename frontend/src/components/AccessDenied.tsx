import React from 'react';

interface AccessDeniedProps {
  message?: string;
}

export function AccessDenied({ message = 'Access denied: this version has not been approved for your role.' }: AccessDeniedProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-soft">
      <div className="text-sm font-semibold uppercase tracking-[0.15em] text-red-600">Access denied</div>
      <p className="mt-2 text-base font-medium">{message}</p>
      <p className="mt-2 text-sm text-red-700">
        This is a frontend demonstration. Backend authorization will ultimately enforce access checks.
      </p>
    </div>
  );
}
