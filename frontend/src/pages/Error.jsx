import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Stethoscope, ArrowLeft, Compass } from 'lucide-react';
import Button from '../components/ui/Button';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center min-h-[70vh] px-4">
      <div className="text-center">
        <span className="icon-chip mx-auto mb-6 h-20 w-20 animate-float">
          <Compass className="h-10 w-10" />
        </span>
        <p className="text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-400 sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-slate-600 dark:text-slate-400">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button variant="primary" size="lg" fullWidth icon={<Home className="h-5 w-5" />}>Go home</Button>
          </Link>
          <Link to="/doctors">
            <Button variant="outline" size="lg" fullWidth icon={<Stethoscope className="h-5 w-5" />}>Find doctors</Button>
          </Link>
          <Button variant="ghost" size="lg" onClick={() => navigate(-1)} icon={<ArrowLeft className="h-5 w-5" />}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
