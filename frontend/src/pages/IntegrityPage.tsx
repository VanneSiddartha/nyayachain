import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ShieldX, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';

export default function IntegrityPage() {
  const { documents, alerts, simulateTamper } = useAppContext();
  const [result, setResult] = useState<string | null>(null);

  const restrictedDocuments = documents.filter((document) => document.integrityStatus === 'RESTRICTED');

  const handleVerify = () => {
    setResult('HASH MISMATCH DETECTED');
  };

  const handleTamper = () => {
    simulateTamper('doc-1', 'v-1');
    setResult('INTEGRITY VERIFICATION FAILED');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Integrity center</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Integrity overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Valid</div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{documents.filter((doc) => doc.integrityStatus === 'VALID').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500"><ShieldX className="h-5 w-5 text-red-600" /> Restricted</div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{restrictedDocuments.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500"><AlertTriangle className="h-5 w-5 text-amber-600" /> Reviewed</div>
          <div className="mt-4 text-3xl font-bold text-slate-900">1</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500"><Sparkles className="h-5 w-5 text-blue-600" /> Alerts</div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{alerts.length}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleVerify} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Verify Integrity</button>
          <button type="button" onClick={handleTamper} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">SIMULATE CYBER ATTACK</button>
          <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Review Alert</button>
        </div>

        {result ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">INTEGRITY VERIFICATION FAILED</div>
            <div className="mt-3 text-lg font-semibold">Reason: SHA-256 mismatch</div>
            <div className="mt-2 text-sm">Previous status: VALID</div>
            <div className="mt-1 text-sm">Current status: RESTRICTED</div>
            <div className="mt-1 text-sm">Alert: OPEN</div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-900">Open alerts</h3>
          {alerts.length === 0 ? <EmptyState title="No integrity alerts" /> : (
            <div className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-red-800">{alert.title}</div>
                    <StatusBadge status={alert.status} />
                  </div>
                  <div className="mt-2 text-sm text-red-700">{alert.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-900">Restricted versions</h3>
          {restrictedDocuments.length === 0 ? <EmptyState title="No restricted versions" /> : (
            <div className="mt-4 space-y-3">
              {restrictedDocuments.map((document) => (
                <div key={document.id} className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <div className="font-medium text-red-800">{document.name}</div>
                  <div className="mt-1 text-sm text-red-700">Version: {document.currentVersion}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
