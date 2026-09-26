import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { DocumentTable } from '../components/DocumentTable';
import { EmptyState } from '../components/EmptyState';
import { UploadModal } from '../components/UploadModal';
import { useAppContext } from '../context/AppContext';

export default function DocumentsPage() {
  const { documents, activeUser } = useAppContext();
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const filtered = documents.filter((document) =>
    document.name.toLowerCase().includes(search.toLowerCase()) || document.caseId.toLowerCase().includes(search.toLowerCase()),
  );

  const handleUpload = (file: File) => {
    console.log('Upload demo file', file.name, 'by', activeUser.name);
    setOpenModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Document registry</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Evidence documents</h1>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search documents"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 md:w-72"
            />
          </div>
          <button type="button" onClick={() => setOpenModal(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Upload document
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No documents" description="No files match your current filter selection." />
      ) : (
        <DocumentTable documents={filtered} />
      )}

      <UploadModal isOpen={openModal} onClose={() => setOpenModal(false)} onUpload={handleUpload} />
    </div>
  );
}
