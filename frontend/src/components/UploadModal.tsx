import React, { ChangeEvent, useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';
import { validateFile } from '../utils/validation';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFile = (file: File | null) => {
    if (!file) return;
    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      setActiveFile(null);
      return;
    }
    setError(null);
    setActiveFile(file);
    setSuccess(false);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = () => {
    if (!activeFile) {
      setError('Please select a valid file first.');
      return;
    }

    setIsUploading(true);
    setError(null);

    setTimeout(() => {
      setIsUploading(false);
      setSuccess(true);
      onUpload(activeFile);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Secure document intake</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Upload evidence</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close upload modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <input ref={inputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.txt" onChange={handleInput} />
          <button type="button" onClick={() => inputRef.current?.click()} className="mx-auto flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700">
            <UploadCloud className="h-5 w-5" />
            Click to upload or drag and drop
          </button>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

        {activeFile ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Secure Document</div>
                <div className="mt-1 font-semibold text-slate-900">{activeFile.name}</div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" defaultChecked />
                Secure Document
              </label>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">File size</div>
                <div className="mt-1 font-medium text-slate-900">{(activeFile.size / (1024 * 1024)).toFixed(2)} MB</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">File type</div>
                <div className="mt-1 font-medium text-slate-900">{activeFile.type || 'TXT'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Status</div>
                <div className="mt-1 font-medium text-emerald-700">VALID</div>
              </div>
            </div>
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Upload complete. Created V1 for secure evidence intake.
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" disabled={!activeFile || isUploading} onClick={handleUpload} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {isUploading ? 'Uploading...' : 'Upload file'}
          </button>
        </div>
      </div>
    </div>
  );
}
