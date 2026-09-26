import React from 'react';
import { CustodyEvent } from '../types';

interface AuditTableProps {
  events: CustodyEvent[];
}

export function AuditTable({ events }: AuditTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Event ID</th>
              <th className="px-4 py-3 font-medium text-slate-600">Case</th>
              <th className="px-4 py-3 font-medium text-slate-600">Document</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actor</th>
              <th className="px-4 py-3 font-medium text-slate-600">Action</th>
              <th className="px-4 py-3 font-medium text-slate-600">Timestamp</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{event.id}</td>
                <td className="px-4 py-3">HYD-CYB-2026-0147</td>
                <td className="px-4 py-3">Forensic_Report.pdf</td>
                <td className="px-4 py-3">{event.actorId === 'system' ? 'System' : event.actorId}</td>
                <td className="px-4 py-3">{event.action}</td>
                <td className="px-4 py-3">{new Date(event.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3">{event.status ?? 'VALID'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
