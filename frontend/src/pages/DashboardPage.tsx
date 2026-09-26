import { AlertTriangle, ArrowRight, FileText, ShieldCheck, ShieldX, UploadCloud } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { StatusBadge } from '../components/StatusBadge';
import { useAppContext } from '../context/AppContext';
import { userDisplayRole } from '../utils/permissions';

export default function DashboardPage() {
  const { activeUser, cases, documents, transfers, alerts } = useAppContext();

  const currentCase = cases[0];
  const restrictedCount = documents.filter((doc) => doc.integrityStatus === 'RESTRICTED').length;
  const pendingTransfers = transfers.filter((transfer) => transfer.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Secure evidence operations</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">SECURE EVIDENCE OPERATIONS</h1>
          <p className="mt-2 text-slate-600">Monitor assigned cases and maintain a tamper-evident chain of custody.</p>
        </div>
        <RoleSwitcher />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Assigned Cases" value={String(cases.length)} detail="Tracked across active casework" />
        <MetricCard label="Active Documents" value={String(documents.length)} detail={String(documents.filter((item) => item.integrityStatus !== 'RESTRICTED').length) + ' Verified • ' + String(restrictedCount) + ' Restricted'} />
        <MetricCard label="Pending Transfers" value={String(pendingTransfers).padStart(2, '0')} detail="Review queue status" />
        <MetricCard label="Integrity Alerts" value={String(alerts.length).padStart(2, '0')} detail="Open watchlist" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active case</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{currentCase.id}</h2>
            </div>
            <StatusBadge status={currentCase.status} />
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-slate-900">{currentCase.name}</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Assigned Officer</div>
                <div className="mt-1 font-medium text-slate-800">{activeUser.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Priority</div>
                <div className="mt-1 font-medium text-slate-800">{currentCase.priority}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Status</div>
                <div className="mt-1 font-medium text-slate-800">{currentCase.status}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Secured Files</div>
                <div className="mt-1 font-medium text-slate-800">{currentCase.secureFileCount}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={`/cases/${currentCase.id}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              Open Case <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/documents" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <FileText className="h-4 w-4" /> View documents
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2 text-red-700"><AlertTriangle className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Integrity alert</p>
                <h3 className="mt-1 font-semibold text-red-900">Evidence_Statement_04.pdf</h3>
              </div>
            </div>
            <div className="mt-3 text-sm text-red-700">Version: V1</div>
            <div className="mt-1 text-sm text-red-700">Message: Hash mismatch detected</div>
            <div className="mt-3"><StatusBadge status="RESTRICTED" /></div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-700"><UploadCloud className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Pending transfer</p>
                <h3 className="mt-1 font-semibold text-amber-900">Forensic_Report.pdf</h3>
              </div>
            </div>
            <div className="mt-3 text-sm text-amber-700">Version V1 • From Ravi Kumar • To Priya Mehta</div>
            <div className="mt-3"><StatusBadge status="PENDING" /></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recent custody activity</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Recent custody events</h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {['DOCUMENT_INGESTED', 'VERSION_CREATED', 'TRANSFER_REQUESTED', 'TRANSFER_APPROVED', 'VERIFICATION_STARTED', 'INTEGRITY_ALERT', 'VERSION_RESTRICTED'].map((eventName) => (
            <div key={eventName} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-800">{eventName}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">{eventName === 'INTEGRITY_ALERT' ? 'ALERT' : 'OK'}</span>
              </div>
              <div className="mt-2 text-sm text-slate-600">Actor: {activeUser.name}</div>
              <div className="mt-1 text-sm text-slate-600">Role: {userDisplayRole(activeUser.role)}</div>
              <div className="mt-1 text-sm text-slate-600">Time: 10:42 AM</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
