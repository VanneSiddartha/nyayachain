import React, { useState } from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { useAppContext } from '../context/AppContext';

export default function TransfersPage() {
  const { transfers, activeUser } = useAppContext();
  const [decision, setDecision] = useState<Record<string, string>>({});

  const handleDecision = (transferId: string, status: 'APPROVED' | 'REJECTED' | 'REVOKED') => {
    setDecision((existing) => ({ ...existing, [transferId]: status }));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Transfer workflow</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Transfer center</h1>
      </div>

      {transfers.length === 0 ? (
        <EmptyState title="No active transfers" description="No transfer records are awaiting review." />
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => {
            const effectiveStatus = decision[transfer.id] ?? transfer.status;
            const canDecide = activeUser.role === 'supervisory_officer' && transfer.status === 'PENDING';

            return (
              <div key={transfer.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Transfer: Forensic_Report.pdf</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">Version {transfer.versionId}</div>
                    <div className="mt-2 text-sm text-slate-600">From: Ravi Kumar • To: Priya Mehta • Status: {effectiveStatus}</div>
                  </div>
                  <StatusBadge status={effectiveStatus} />
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  {transfer.reason}
                </div>

                {canDecide ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={() => handleDecision(transfer.id, 'APPROVED')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button type="button" onClick={() => handleDecision(transfer.id, 'REJECTED')} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </div>
                ) : null}

                {activeUser.role === 'investigating_officer' && transfer.status === 'PENDING' ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    Transfer cannot be approved by the requesting officer.
                  </div>
                ) : null}

                {activeUser.role === 'legal_reviewer' && effectiveStatus === 'PENDING' ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    Access denied: this version has not been approved for your role.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
