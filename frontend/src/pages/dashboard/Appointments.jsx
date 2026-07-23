import React, { useMemo, useState } from 'react';
import { Search, Filter, CalendarPlus, Globe, Building2 } from 'lucide-react';
import SectionCard from '../../components/dashboard/SectionCard';
import StatusPill from '../../components/dashboard/StatusPill';
import { todaysAppointments, currency } from '../../utils/dashboardData';

const tabs = ['All', 'Booked', 'Checked-in', 'In progress', 'Completed', 'No-show'];

const Appointments = () => {
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
      todaysAppointments.filter((a) => {
        const matchTab = tab === 'All' || a.status === tab;
        const q = query.trim().toLowerCase();
        const matchQuery = !q || a.patient.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
        return matchTab && matchQuery;
      }),
    [tab, query]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient, doctor, or ID…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Filter className="h-4 w-4" /> Filters</button>
          <button className="btn btn-primary btn-sm"><CalendarPlus className="h-4 w-4" /> New appointment</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <SectionCard bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-5 py-3 font-semibold">ID / Token</th>
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Doctor</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">Source</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Time</th>
                <th className="px-5 py-3 font-semibold">Fee</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70">
              {rows.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3">
                    <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{a.id}</p>
                    <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500 dark:bg-slate-800">{a.token}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-100">{a.patient}</td>
                  <td className="hidden px-5 py-3 md:table-cell">
                    <p className="text-slate-700 dark:text-slate-300">{a.doctor}</p>
                    <p className="text-xs text-slate-400">{a.dept}</p>
                  </td>
                  <td className="hidden px-5 py-3 lg:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      {a.source === 'web' ? <Globe className="h-3.5 w-3.5 text-primary-500" /> : <Building2 className="h-3.5 w-3.5 text-sky-500" />}
                      {a.source === 'web' ? 'Website' : 'Staff'}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3 text-slate-600 dark:text-slate-300 sm:table-cell">{a.time}</td>
                  <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">{currency(a.fee)}</td>
                  <td className="px-5 py-3"><StatusPill status={a.status} /></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No appointments match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default Appointments;
