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
                <div className="section-shell p-8 sm:p-10">
                  <p className="section-kicker">Dashboard</p>
                  <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome back 👋
                  </h1>
                  <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                    This is a protected area. Your appointments, prescriptions, and billing history will appear here
                    once the backend is connected.
                  </p>
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
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email or phone
                </label>
                <input type="text" placeholder="you@example.com" className="input" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
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
              <p className="text-center text-xs text-slate-400">
                Demo mode — any credentials will sign you in.
              </p>
            </div>
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