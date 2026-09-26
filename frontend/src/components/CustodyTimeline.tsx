import React from 'react';
import { CustodyEvent } from '../types';

interface CustodyTimelineProps {
  events: CustodyEvent[];
}

export function CustodyTimeline({ events }: CustodyTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Custody timeline</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Event chain</h3>
        </div>
      </div>

      <div className="relative space-y-6 before:absolute before:left-4 before:top-1 before:h-[calc(100%-8px)] before:w-px before:bg-slate-200">
        {events.map((event) => (
          <div key={event.id} className="relative pl-10">
            <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-blue-100 text-center text-[10px] font-bold text-blue-700 ring-4 ring-white flex items-center justify-center">
              {event.action.slice(0, 2)}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">{event.action}</div>
                {event.status ? <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{event.status}</span> : null}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                <div>Actor: {event.actorId === 'system' ? 'System' : event.actorId}</div>
                <div>Role: {event.role}</div>
                <div>Timestamp: {new Date(event.timestamp).toLocaleString()}</div>
                {event.recipientId ? <div>Recipient: {event.recipientId}</div> : null}
                {event.details ? <div>{event.details}</div> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
