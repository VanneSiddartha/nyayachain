import React from 'react';
import { Link } from 'react-router-dom';
import { Transfer } from '../types';
import { StatusBadge } from './StatusBadge';

interface TransferTableProps {
  transfers: Transfer[];
}

export function TransferTable({ transfers }: TransferTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Transfer</th>
              <th className="px-4 py-3 font-medium text-slate-600">From</th>
              <th className="px-4 py-3 font-medium text-slate-600">To</th>
              <th className="px-4 py-3 font-medium text-slate-600">Reason</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer.id} className="border-t border-slate-200">
                <td className="px-4 py-3">
                  <Link to={`/transfers`} className="font-medium text-blue-600 hover:text-blue-700">{transfer.id}</Link>
                </td>
                <td className="px-4 py-3">Ravi Kumar</td>
                <td className="px-4 py-3">Priya Mehta</td>
                <td className="px-4 py-3 text-slate-600">{transfer.reason}</td>
                <td className="px-4 py-3"><StatusBadge status={transfer.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
