import React, { useState } from 'react';

interface HashDisplayProps {
  hash: string;
  label?: string;
}

export function HashDisplay({ hash, label = 'Hash' }: HashDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</div>
      <div className="mt-2 break-all font-mono text-sm text-slate-700">
        {expanded ? hash : `${hash.slice(0, 16)}...${hash.slice(-8)}`}
      </div>
      <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700">
        {expanded ? 'Hide full hash' : 'View full hash'}
      </button>
    </div>
  );
}
