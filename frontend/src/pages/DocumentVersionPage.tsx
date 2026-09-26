import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { HashDisplay } from '../components/HashDisplay';
import { StatusBadge } from '../components/StatusBadge';

export default function DocumentVersionPage() {
  const { documentId, versionId } = useParams();
  const { documents } = useAppContext();

  const document = documents.find((item) => item.id === documentId);
  const version = document?.versions.find((item) => item.id === versionId);

  if (!document || !version) {
    return <EmptyState title="Version not found" description="This version is not available in the demo evidence chain." />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Version page</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{document.name}</h1>
          </div>
          <StatusBadge status={version.status} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Version</div>
            <div className="mt-1 font-medium text-slate-800">{version.version}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Status</div>
            <div className="mt-1 font-medium text-slate-800">{version.status}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Uploaded by</div>
            <div className="mt-1 font-medium text-slate-800">{version.uploadedBy}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Created</div>
            <div className="mt-1 font-medium text-slate-800">{new Date(version.createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <HashDisplay hash={version.sha256} label="SHA-256" />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Storage key</div>
            <div className="mt-2 break-all font-mono">{version.storageKey}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h3 className="text-xl font-semibold text-slate-900">Version history</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {document.versions.map((entry) => (
            <div key={entry.id} className={`rounded-xl border p-3 ${entry.id === version.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="font-semibold text-slate-900">{entry.version}</div>
              <div className="mt-1 text-xs text-slate-500">{entry.status}</div>
            </div>
          ))}
        </div>
      </div>

      {version.status === 'RESTRICTED' ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-soft">
          <div className="flex items-center gap-2"><ShieldAlert className="h-5 w-5" /> <span className="font-semibold">Access restricted</span></div>
          <p className="mt-2 text-sm">This version remains restricted after integrity review and cannot be restored to VALID without backend confirmation.</p>
        </div>
      ) : null}
    </div>
  );
}
