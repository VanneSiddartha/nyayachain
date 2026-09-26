import React, { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { AuditTable } from '../components/AuditTable';
import { EmptyState } from '../components/EmptyState';
import { useAppContext } from '../context/AppContext';

export default function AuditPage() {
  const { custodyEvents } = useAppContext();
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [actorFilter, setActorFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return custodyEvents.filter((event) => {
      const caseMatch = caseFilter === 'ALL' || 'HYD-CYB-2026-0147' === caseFilter;
      const actorMatch = actorFilter === 'ALL' || event.actorId === actorFilter;
      const actionMatch = actionFilter === 'ALL' || event.action === actionFilter;
      return caseMatch && actorMatch && actionMatch;
    });
  }, [actionFilter, actorFilter, caseFilter, custodyEvents]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Audit workspace</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Read-only audit trail</h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="grid gap-3 md:grid-cols-4">
          <select value={caseFilter} onChange={(event) => setCaseFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
            <option value="ALL">Case</option>
            <option value="HYD-CYB-2026-0147">HYD-CYB-2026-0147</option>
          </select>
          <select value={actorFilter} onChange={(event) => setActorFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
            <option value="ALL">Actor</option>
            <option value="u1">Ravi Kumar</option>
            <option value="u2">Anita Sharma</option>
            <option value="system">System</option>
          </select>
          <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
            <option value="ALL">Action</option>
            <option value="DOCUMENT_INGESTED">DOCUMENT_INGESTED</option>
            <option value="VERSION_CREATED">VERSION_CREATED</option>
            <option value="TRANSFER_REQUESTED">TRANSFER_REQUESTED</option>
            <option value="TRANSFER_APPROVED">TRANSFER_APPROVED</option>
            <option value="VERIFICATION_STARTED">VERIFICATION_STARTED</option>
            <option value="INTEGRITY_ALERT">INTEGRITY_ALERT</option>
            <option value="VERSION_RESTRICTED">VERSION_RESTRICTED</option>
          </select>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState title="No audit events" description="No events match the selected audit filters." /> : <AuditTable events={filtered} />}
    </div>
  );
}
