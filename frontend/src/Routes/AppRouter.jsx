import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate 
} from 'react-router-dom';

// Layouts
import Layout from '../components/common/Layout';
import AuthLayout from '../components/common/AuthLayout';

// Pages
import Home from '../pages/Home';
import Doctor from '../pages/Doctor';
import DoctorDetail from '../pages/DoctorDetail';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/Error';
import Services from '../pages/Services';
import ServiceDetail from '../pages/ServiceDetail';

// Components
import  LoadingSpinner  from '../components/ui/LoadingSpinner';

// Lazy loading wrapper
const RouteWrapper = ({ children }) => (
  <React.Suspense fallback={
    <div className="flex-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  }>
    {children}
  </React.Suspense>
);

// Auth guard
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <RouteWrapper>
            <Home />
          </RouteWrapper>
        ),
      },
      {
        path: 'doctors',
        element: (
          <RouteWrapper>
            <Doctor />
          </RouteWrapper>
        ),
      },
      {
        path: 'doctors/:id',
        element: (
          <RouteWrapper>
            <DoctorDetail />
          </RouteWrapper>
        ),
      },
      {
        path: 'services',
        element: (
          <RouteWrapper>
            <Services />
          </RouteWrapper>
        ),
      },
      {
        path: 'services/:serviceId',
        element: (
          <RouteWrapper>
            <ServiceDetail />
          </RouteWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <RouteWrapper>
            <About />
          </RouteWrapper>
        ),
      },
      {
        path: 'contact',
        element: (
          <RouteWrapper>
            <Contact />
          </RouteWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <RouteWrapper>
              <div className="container-custom py-12">
                <p className="eyebrow">Dashboard</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Welcome back
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Your appointments, prescriptions, and payments will appear here.
                </p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: 'Upcoming appointments', value: '2' },
                    { label: 'Pending invoices', value: 'Rs. 1,500' },
                    { label: 'Prescriptions', value: '5' },
                  ].map((item) => (
                    <div key={item.label} className="card card--flat">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RouteWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'home',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <RouteWrapper>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem('auth_token', 'demo_token');
                window.location.href = '/dashboard';
              }}
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone or email
                </label>
                <input className="input" placeholder="98XXXXXXXX" defaultValue="98XXXXXXXX" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input type="password" className="input" placeholder="••••••••" defaultValue="demo1234" />
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                Sign in
              </button>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Demo mode — any credentials sign you in.
              </p>
            </form>
          </RouteWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;