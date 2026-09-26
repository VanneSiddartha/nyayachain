import React from 'react';
import { FileText, Eye, Download, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DocumentItem } from '../types';
import { StatusBadge } from './StatusBadge';

interface DocumentTableProps {
  documents: DocumentItem[];
}

export function DocumentTable({ documents }: DocumentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Document</th>
              <th className="px-4 py-3 font-medium text-slate-600">Type</th>
              <th className="px-4 py-3 font-medium text-slate-600">Case</th>
              <th className="px-4 py-3 font-medium text-slate-600">Version</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 font-medium text-slate-600">Uploaded by</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-t border-slate-200">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <Link to={`/documents/${document.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                        {document.name}
                      </Link>
                      <div className="text-xs text-slate-500">{document.fileType}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{document.type}</td>
                <td className="px-4 py-3">{document.caseId}</td>
                <td className="px-4 py-3">{document.currentVersion}</td>
                <td className="px-4 py-3"><StatusBadge status={document.integrityStatus} /></td>
                <td className="px-4 py-3">{document.uploadedBy}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/documents/${document.id}`} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label={`View ${document.name}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label={`Download ${document.name}`}>
                      <Download className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600" aria-label={`View alert for ${document.name}`}>
                      <ShieldAlert className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
