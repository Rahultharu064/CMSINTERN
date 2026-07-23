import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const titles = {
  '/dashboard': { title: 'Overview', subtitle: "Today's clinic activity at a glance" },
  '/dashboard/appointments': { title: 'Appointments', subtitle: 'Manage bookings, check-ins and status' },
  '/dashboard/patients': { title: 'Patients', subtitle: 'Registry and visit history' },
  '/dashboard/doctors': { title: 'Doctors', subtitle: 'Specialists, availability and load' },
  '/dashboard/queue': { title: 'Live Queue', subtitle: 'Real-time token status per doctor' },
  '/dashboard/billing': { title: 'Billing', subtitle: 'Invoices and payments' },
  '/dashboard/reports': { title: 'Reports', subtitle: 'Revenue and operational insights' },
  '/dashboard/settings': { title: 'Settings', subtitle: 'Clinic profile and preferences' },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = titles[pathname] || { title: 'Dashboard', subtitle: '' };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <Topbar onMenu={() => setSidebarOpen(true)} title={meta.title} subtitle={meta.subtitle} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
