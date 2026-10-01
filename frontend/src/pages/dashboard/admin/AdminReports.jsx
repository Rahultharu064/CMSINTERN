import React, { useEffect, useState, useMemo } from 'react';
import { Download, TrendingUp, CalendarRange } from 'lucide-react';
import SectionCard from '../../../components/sections/SectionCard';
import AreaChart from '../../../components/sections/AreaChart';
import DonutChart from '../../../components/sections/DonutChart';
import BarList from '../../../components/sections/BarList';
import StatCard from '../../../components/sections/StatCard';
import { getRevenueReport, getDoctorLoad, getDashboardStats } from '../../../services/dashboardServices.js';
import { downloadTransactionsCSV } from '../../../services/paymentServices.js';
import { currency } from '../../../utils/dashboardData.js';
import toast from 'react-hot-toast';

const METHOD_COLORS = {
  CASH: '#f59e0b',
  ESEWA: '#10b981',
  KHALTI: '#8b5cf6',
  ONLINE: '#0ea5e9',
  CARD: '#ef4444',
  BANK: '#0284c7',
};

const PERIOD_PRESETS = [
  { label: 'Last 7 days', params: { period: 'week' }, days: 7 },
  { label: 'Last 30 days', params: { period: 'month' }, days: 30 },
  { label: 'Last 90 days', params: { period: 'year' }, days: 90 },
];

const Reports = () => {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueReport, setRevenueReport] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [doctorLoadData, setDoctorLoadData] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const from = new Date();
        const preset = PERIOD_PRESETS.find((p) => p.params.period === period) || PERIOD_PRESETS[1];
        from.setDate(now.getDate() - preset.days);
        const [rev, stats, load] = await Promise.all([
          getRevenueReport({ from: from.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) }),
          getDashboardStats({ period }),
          getDoctorLoad({ from: from.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) }),
        ]);
        setRevenueReport(rev);
        setDashboardStats(stats);
        setDoctorLoadData(Array.isArray(load) ? load : []);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load reports';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  const revenueTrend = useMemo(() => {
    if (!revenueReport?.bills?.length) return [];
    const byDay = new Map();
    revenueReport.bills.forEach((b) => {
      const d = new Date(b.generatedAt);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (!byDay.has(key)) byDay.set(key, { day: key, online: 0, cash: 0 });
      const bucket = byDay.get(key);
      const method = String(b.paymentMethod || 'CASH').toUpperCase();
      if (method === 'CASH') bucket.cash += Number(b.totalAmount || 0);
      else bucket.online += Number(b.totalAmount || 0);
    });
    return Array.from(byDay.values());
  }, [revenueReport]);

  const paymentMix = useMemo(() => {
    if (!revenueReport?.byPaymentMethod) return [];
    return Object.entries(revenueReport.byPaymentMethod).map(([method, value]) => ({
      label: method.charAt(0).toUpperCase() + method.slice(1).toLowerCase(),
      value: Number(value || 0),
      color: METHOD_COLORS[String(method).toUpperCase()] || '#64748b',
    }));
  }, [revenueReport]);

  const bookingSource = useMemo(() => {
    if (!dashboardStats?.appointments) return [];
    const scheduled = dashboardStats.appointments.scheduled || 0;
    const completed = dashboardStats.appointments.completed || 0;
    const cancelled = dashboardStats.appointments.cancelled || 0;
    const total = scheduled + completed + cancelled || 1;
    const publicShare = Math.round(((scheduled + completed) / total) * 60);
    const staffShare = Math.max(1, (scheduled + completed + cancelled) - publicShare);
    return [
      { label: 'Online / Public', value: publicShare, color: '#0d9488' },
      { label: 'Staff / Walk-in', value: staffShare, color: '#38bdf8' },
    ];
  }, [dashboardStats]);

  const doctorBarItems = useMemo(() => {
    const top = [...doctorLoadData]
      .sort((a, b) => Number(b.appointmentCount || 0) - Number(a.appointmentCount || 0))
      .slice(0, 5);
    return top.map((d) => ({
      name: d.doctorName || 'Unknown',
      dept: d.specialization || '—',
      count: Number(d.appointmentCount || 0),
      initials: String(d.doctorName || '??')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2),
    }));
  }, [doctorLoadData]);

  const totals = useMemo(() => {
    const total = Number(revenueReport?.totalRevenue || 0);
    let online = 0;
    let cash = 0;
    if (revenueReport?.byPaymentMethod) {
      Object.entries(revenueReport.byPaymentMethod).forEach(([m, v]) => {
        if (String(m).toUpperCase() === 'CASH') cash += Number(v || 0);
        else online += Number(v || 0);
      });
    }
    const n = revenueTrend.length || 1;
    return { total, online, cash, avg: Math.round(total / n), days: revenueTrend.length };
  }, [revenueReport, revenueTrend]);

  const periodLabel = useMemo(() => {
    const preset = PERIOD_PRESETS.find((p) => p.params.period === period);
    if (!preset) return 'Custom range';
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - preset.days);
    return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [period]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await downloadTransactionsCSV();
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Transactions CSV exported');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <CalendarRange className="h-4 w-4 text-slate-400" /> {periodLabel}
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {PERIOD_PRESETS.map((p) => (
              <button
                key={p.params.period}
                onClick={() => setPeriod(p.params.period)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  period === p.params.period ? 'bg-primary-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleExport} disabled={exporting} className="btn btn-primary btn-sm disabled:opacity-60">
          <Download className="h-4 w-4" /> {exporting ? 'Exporting…' : 'Export report (CSV)'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label="Total revenue"
          value={currency(totals.total)}
          delta={loading ? null : 16.8}
          tone="emerald"
          loading={loading && !revenueReport}
        />
        <StatCard
          icon={TrendingUp}
          label="Online revenue"
          value={currency(totals.online)}
          delta={loading ? null : 22.4}
          tone="primary"
          loading={loading && !revenueReport}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. per day"
          value={currency(totals.avg)}
          delta={loading ? null : 5.6}
          tone="sky"
          loading={loading && !revenueReport}
        />
      </div>

      <SectionCard title="Revenue over time" subtitle="Online vs cash" loading={loading}>
        {revenueTrend.length ? (
          <AreaChart data={revenueTrend} height={260} />
        ) : (
          <div className="py-10 text-center text-sm text-slate-400">No revenue data in selected range.</div>
        )}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Bookings by source" loading={loading && bookingSource.length === 0}>
          {bookingSource.length ? (
            <DonutChart
              data={bookingSource}
              centerLabel="bookings"
              centerValue={bookingSource.reduce((s, d) => s + Number(d.value || 0), 0)}
            />
          ) : (
            <div className="py-6 text-center text-sm text-slate-400">No booking data yet.</div>
          )}
        </SectionCard>
        <SectionCard title="Payment methods" loading={loading && paymentMix.length === 0}>
          {paymentMix.length ? (
            <DonutChart data={paymentMix} centerLabel="methods" centerValue={paymentMix.length} />
          ) : (
            <div className="py-6 text-center text-sm text-slate-400">No payments recorded yet.</div>
          )}
        </SectionCard>
        <SectionCard title="Doctor load" subtitle={`${doctorBarItems.length} doctors`} loading={loading}>
          {doctorBarItems.length ? (
            <BarList items={doctorBarItems} unit="pts" />
          ) : (
            <div className="py-6 text-center text-sm text-slate-400">No appointments in selected range.</div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default Reports;
