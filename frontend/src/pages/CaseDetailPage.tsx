import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, FileText, ShieldAlert, ShieldCheck, UserRound, Clock3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AccessDenied } from '../components/AccessDenied';
import { StatusBadge } from '../components/StatusBadge';
import { CustodyTimeline } from '../components/CustodyTimeline';
import { EmptyState } from '../components/EmptyState';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { can } from '../utils/permissions';

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const { activeUser, cases, documents, custodyEvents, alerts, verificationResults } = useAppContext();

  const caseItem = cases.find((item) => item.id === caseId);
  const relatedDocs = useMemo(() => documents.filter((doc) => doc.caseId === caseId), [documents, caseId]);

  if (!caseItem) {
    return <EmptyState title="Case not found" description="The selected case could not be located in the demo workspace." />;
  }

  const canReview = can(activeUser, 'audit_access');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Case details</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{caseItem.name}</h1>
        </div>
        <RoleSwitcher />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{caseItem.id}</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{caseItem.name}</div>
          </div>
          <StatusBadge status={caseItem.status} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Priority</div>
            <div className="mt-1 font-medium text-slate-800">{caseItem.priority}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Status</div>
            <div className="mt-1 font-medium text-slate-800">{caseItem.status}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Assigned officers</div>
            <div className="mt-1 font-medium text-slate-800">Ravi Kumar, Anita Sharma</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Last activity</div>
            <div className="mt-1 font-medium text-slate-800">{new Date(caseItem.lastActivity).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-slate-900">Documents</h3>
            </div>
            {relatedDocs.length === 0 ? <EmptyState title="No documents in this case" /> : (
              <div className="space-y-3">
                {relatedDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <div className="font-medium text-slate-900">{doc.name}</div>
                      <div className="text-sm text-slate-500">Current version: {doc.currentVersion}</div>
                    </div>
                    <StatusBadge status={doc.integrityStatus} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <h3 className="text-xl font-semibold text-slate-900">Integrity alerts</h3>
            </div>
            {alerts.length === 0 ? <EmptyState title="No integrity alerts" /> : (
              <div className="space-y-3">
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
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-slate-900">Transfer activity</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="font-medium text-slate-800">Forensic_Report.pdf</div>
                <div className="mt-1 text-sm text-slate-600">Version V1 • Requested by Ravi Kumar • To Priya Mehta</div>
                <div className="mt-2"><StatusBadge status="PENDING" /></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="text-xl font-semibold text-slate-900">Verification results</h3>
            </div>
            {verificationResults.length === 0 ? <EmptyState title="No verification results" /> : (
              <div className="space-y-3">
                {verificationResults.map((result) => (
                  <div key={result.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-800">{result.versionId}</div>
                      <StatusBadge status={result.status} />
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{result.reason}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!canReview ? <AccessDenied message="Access denied: this case is not assigned to your role." /> : null}

      <CustodyTimeline events={custodyEvents} />
    </div>
  );
}
