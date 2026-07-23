import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

import {
  CalendarDays,
  Users,
  ListOrdered,
  Receipt,
} from 'lucide-react';

const navItems = [
  { to: '/staff/queue', label: 'Live Queue', icon: ListOrdered, dot: true },
  { to: '/staff/appointments', label: 'Appointments', icon: CalendarDays, badge: '48' },
  { to: '/staff/patients', label: 'Patients', icon: Users },
  { to: '/staff/billing', label: 'Billing', icon: Receipt },
];

const titles = {
  '/staff/queue': { title: 'Live Queue', subtitle: 'Real-time token status per doctor' },
  '/staff/appointments': { title: 'Appointments', subtitle: 'Manage bookings, check-ins and status' },
  '/staff/patients': { title: 'Patients', subtitle: 'Registry and visit history' },
  '/staff/billing': { title: 'Billing', subtitle: 'Invoices and payments' },
};

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = titles[pathname] || { title: 'Dashboard', subtitle: '' };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} navItems={navItems} title="Staff Portal" />

      <div className="lg:pl-72">
        <Topbar onMenu={() => setSidebarOpen(true)} title={meta.title} subtitle={meta.subtitle} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
