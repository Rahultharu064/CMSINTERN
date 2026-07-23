import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import Layout from '../components/common/Layout';
import AuthLayout from '../components/common/AuthLayout';
import DashboardLayout from '../components/dashboard/DashboardLayout';

// Public pages
import Home from '../pages/Home';
import Doctor from '../pages/Doctor';
import DoctorDetail from '../pages/DoctorDetail';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/Error';
import Services from '../pages/Services';
import ServiceDetail from '../pages/ServiceDetail';

// Dashboard pages
import Overview from '../pages/dashboard/Overview';
import Appointments from '../pages/dashboard/Appointments';
import Patients from '../pages/dashboard/Patients';
import DashboardDoctors from '../pages/dashboard/Doctors';
import Queue from '../pages/dashboard/Queue';
import Billing from '../pages/dashboard/Billing';
import Reports from '../pages/dashboard/Reports';
import DashboardSettings from '../pages/dashboard/Settings';

import LoadingSpinner from '../components/ui/LoadingSpinner';

const RouteWrapper = ({ children }) => (
  <React.Suspense
    fallback={
      <div className="flex-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    }
  >
    {children}
  </React.Suspense>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth_token');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  // ---- Public website ----
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <RouteWrapper><Home /></RouteWrapper> },
      { path: 'doctors', element: <RouteWrapper><Doctor /></RouteWrapper> },
      { path: 'doctors/:id', element: <RouteWrapper><DoctorDetail /></RouteWrapper> },
      { path: 'services', element: <RouteWrapper><Services /></RouteWrapper> },
      { path: 'services/:serviceId', element: <RouteWrapper><ServiceDetail /></RouteWrapper> },
      { path: 'about', element: <RouteWrapper><About /></RouteWrapper> },
      { path: 'contact', element: <RouteWrapper><Contact /></RouteWrapper> },
      { path: 'home', element: <Navigate to="/" replace /> },
    ],
  },

  // ---- Authenticated dashboard (own shell) ----
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'patients', element: <Patients /> },
      { path: 'doctors', element: <DashboardDoctors /> },
      { path: 'queue', element: <Queue /> },
      { path: 'billing', element: <Billing /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <DashboardSettings /> },
    ],
  },

  // ---- Auth ----
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <RouteWrapper>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email or phone</label>
                <input type="text" placeholder="you@example.com" className="input" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input type="password" placeholder="••••••••" className="input" />
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('auth_token', 'demo_token');
                  window.location.href = '/dashboard';
                }}
                className="btn btn-primary btn-full"
              >
                Sign in
              </button>
              <p className="text-center text-xs text-slate-400">Demo mode — any credentials will sign you in.</p>
            </div>
          </RouteWrapper>
        ),
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
