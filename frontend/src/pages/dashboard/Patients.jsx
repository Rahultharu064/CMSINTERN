import React, { useMemo, useState } from 'react';
import { Search, UserPlus, Globe, Building2, Phone } from 'lucide-react';
import SectionCard from '../../components/dashboard/SectionCard';
import { patients } from '../../utils/dashboardData';

const avatarTones = ['bg-primary-100 text-primary-700', 'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700', 'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700'];

const Patients = () => {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or patient ID…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <button className="btn btn-primary btn-sm"><UserPlus className="h-4 w-4" /> Register patient</button>
      </div>

      <SectionCard bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Contact</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Age / Gender</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">Source</th>
                <th className="px-5 py-3 font-semibold">Visits</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Last visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70">
              {rows.map((p, i) => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold dark:bg-slate-800 dark:text-slate-200 ${avatarTones[i % avatarTones.length]}`}>
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{p.name}</p>
                        <p className="font-mono text-xs text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><Phone className="h-3.5 w-3.5 text-slate-400" /> {p.phone}</span>
                  </td>
                  <td className="hidden px-5 py-3 text-slate-600 dark:text-slate-300 md:table-cell">{p.age} · {p.gender}</td>
                  <td className="hidden px-5 py-3 lg:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      {p.source === 'web' ? <Globe className="h-3.5 w-3.5 text-primary-500" /> : <Building2 className="h-3.5 w-3.5 text-sky-500" />}
                      {p.source === 'web' ? 'Website' : 'Staff'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{p.visits}</span>
                  </td>
                  <td className="hidden px-5 py-3 text-slate-500 sm:table-cell">{p.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default Patients;
