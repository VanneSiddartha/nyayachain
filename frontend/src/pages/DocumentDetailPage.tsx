import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AccessDenied } from '../components/AccessDenied';
import { HashDisplay } from '../components/HashDisplay';
import { StatusBadge } from '../components/StatusBadge';
import { can } from '../utils/permissions';
import { EmptyState } from '../components/EmptyState';

export default function DocumentDetailPage() {
  const { documentId } = useParams();
  const { activeUser, documents } = useAppContext();
  const [accessGranted, setAccessGranted] = useState(false);

  const document = useMemo(() => documents.find((item) => item.id === documentId), [documents, documentId]);

  if (!document) {
    return <EmptyState title="Document not found" description="The selected document could not be located in the evidence register." />;
  }

  const allowed = can(activeUser, 'download', document.integrityStatus === 'RESTRICTED' ? 'restricted' : undefined);
  const canAccess = activeUser.role === 'legal_reviewer' ? !accessGranted && document.integrityStatus !== 'RESTRICTED' : allowed;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Document detail</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{document.name}</h1>
          </div>
          <StatusBadge status={document.integrityStatus} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Document type</div>
            <div className="mt-1 font-medium text-slate-800">{document.type}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Case</div>
            <div className="mt-1 font-medium text-slate-800">{document.caseId}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Current version</div>
            <div className="mt-1 font-medium text-slate-800">{document.currentVersion}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Uploaded by</div>
            <div className="mt-1 font-medium text-slate-800">{document.uploadedBy}</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <Lock className="h-5 w-5 text-slate-500" />
            <span className="font-medium">Versioned evidence access</span>
          </div>

          {document.integrityStatus === 'RESTRICTED' ? (
            <AccessDenied message="Access denied: this version is restricted because integrity verification failed." />
          ) : canAccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" /> Access granted</div>
              <div className="mt-2 text-sm">Document view is available for the approved version scope.</div>
              <button type="button" onClick={() => setAccessGranted(true)} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Grant access for demo
              </button>
            </div>
          ) : (
            <AccessDenied message="Access denied: this version has not been approved for your role." />
          )}

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <HashDisplay hash={document.versions[0]?.sha256 ?? 'mock-demo-hash-001'} label="SHA-256" />
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Version history</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {document.versions.map((version) => (
                  <Link key={version.id} to={`/documents/${document.id}/versions/${version.id}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">
                    {version.version}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <h3 className="text-xl font-semibold text-slate-900">Integrity summary</h3>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <div>Current status: <span className="font-semibold text-slate-900">{document.integrityStatus}</span></div>
          <div>Storage key: demo://doc-1/V1/secure</div>
          <div>Upload time: {new Date(document.lastUpdated).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
