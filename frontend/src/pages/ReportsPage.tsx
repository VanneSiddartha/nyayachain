import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ReportsPage() {
  const { documents, alerts, verificationResults } = useAppContext();

  const report = {
    caseId: 'HYD-CYB-2026-0147',
    document: documents[0]?.name ?? 'Forensic_Report.pdf',
    version: 'V1',
    sha256: documents[0]?.versions[0]?.sha256 ?? 'mock-demo-hash-001',
    verificationResult: verificationResults[1]?.reason ?? 'SHA-256 mismatch',
    verificationTimestamp: verificationResults[1]?.verifiedAt ?? new Date().toISOString(),
    custodyEvents: 7,
    integrityAlerts: alerts.length,
    status: 'RESTRICTED',
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Technical integrity</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Technical Integrity Report</h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2 text-slate-700">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-medium">Case evidence summary</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Case ID</div><div className="mt-1 font-medium text-slate-900">{report.caseId}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Document</div><div className="mt-1 font-medium text-slate-900">{report.document}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Version</div><div className="mt-1 font-medium text-slate-900">{report.version}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">SHA-256</div><div className="mt-1 font-medium text-slate-900">{report.sha256}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Verification result</div><div className="mt-1 font-medium text-slate-900">{report.verificationResult}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Verification timestamp</div><div className="mt-1 font-medium text-slate-900">{new Date(report.verificationTimestamp).toLocaleString()}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Custody events</div><div className="mt-1 font-medium text-slate-900">{report.custodyEvents}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Integrity alerts</div><div className="mt-1 font-medium text-slate-900">{report.integrityAlerts}</div></div>
          <div><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Current status</div><div className="mt-1 font-medium text-slate-900">{report.status}</div></div>
        </div>

        <button type="button" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          <Download className="h-4 w-4" /> Export Technical Integrity Report
        </button>
      </div>
    </div>
  );
}
