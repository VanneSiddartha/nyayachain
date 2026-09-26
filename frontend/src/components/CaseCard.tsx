import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NyayaCase } from '../types';
import { StatusBadge } from './StatusBadge';

interface CaseCardProps {
  caseItem: NyayaCase;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{caseItem.id}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{caseItem.name}</h3>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Assigned officer</div>
          <div className="mt-1 font-medium text-slate-800">Ravi Kumar</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Priority</div>
          <div className="mt-1 font-medium text-slate-800">{caseItem.priority}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
        <span>{caseItem.secureFileCount} secured files</span>
        <Link to={`/cases/${caseItem.id}`} className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700">
          Open Case <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
