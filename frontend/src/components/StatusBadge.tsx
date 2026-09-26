import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const toneMap: Record<string, { bg: string; text: string; dot: string }> = {
  VALID: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  ACTIVE: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  RESTRICTED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  REVOKED: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
  REVIEWED: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  OPEN: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  RESOLVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  DEFAULT: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const tone = toneMap[status.toUpperCase()] ?? toneMap.DEFAULT;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${tone.bg} ${tone.text} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
      {status}
    </span>
  );
}
