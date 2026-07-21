import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Stethoscope,
  HeartPulse,
  Info,
  Mail,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { services } from '../../config/services';
import Button from '../ui/Button';

const navLinks = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/doctors', label: 'Doctors', Icon: Stethoscope },
  { path: '/services', label: 'Services', Icon: HeartPulse },
  { path: '/about', label: 'About', Icon: Info },
  { path: '/contact', label: 'Contact', Icon: Mail },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('auth_token'));
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsServicesDropdownOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isServicesDropdownOpen && !event.target.closest('.services-dropdown')) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isServicesDropdownOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`site-header border-b transition-all duration-300 ${
        isScrolled
          ? 'border-slate-200/70 bg-white/85 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:border-slate-700/60 dark:bg-slate-900/85'
          : 'border-transparent bg-white/80 dark:bg-slate-900/80'
      }`}
    >
      <div className="container-custom">
        <div className="flex-between py-3.5 sm:py-4">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3" aria-label="ClinicMS home">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-lg shadow-primary-500/25 transition-transform duration-300 group-hover:scale-105">
              <HeartPulse className="h-6 w-6" strokeWidth={2.4} />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
              Clinic<span className="text-primary-600 dark:text-primary-400">MS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/70 p-1 shadow-sm md:flex dark:border-slate-700/60 dark:bg-slate-800/60">
            {navLinks.map((link) => {
              if (link.path === '/services') {
                const servicesActive = location.pathname.startsWith('/services');
                return (
                  <div key={link.path} className="services-dropdown relative">
                    <button
                      onClick={() => setIsServicesDropdownOpen((v) => !v)}
                      onMouseEnter={() => setIsServicesDropdownOpen(true)}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        servicesActive
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-white hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-primary-300'
                      }`}
                      aria-expanded={isServicesDropdownOpen}
                      aria-haspopup="true"
                    >
                      <link.Icon className="h-4 w-4" />
                      {link.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isServicesDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isServicesDropdownOpen && (
                      <div
                        className="animate-slide-down absolute left-1/2 top-full mt-2 w-80 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                        onMouseLeave={() => setIsServicesDropdownOpen(false)}
                      >
                        <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-700">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Medical specialties
                          </p>
                        </div>
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto p-1.5">
                          {services.slice(0, 8).map((service) => (
                            <Link
                              key={service.id}
                              to={`/services/${service.id}`}
                              className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary-50 dark:hover:bg-slate-700/60"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-slate-700 dark:text-primary-300">
                                <service.Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  {service.label}
                                </p>
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                  {service.tagline}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link
                          to="/services"
                          className="flex items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-50 dark:border-slate-700 dark:text-primary-300 dark:hover:bg-slate-700/60"
                        >
                          View all services <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-primary-300'
                  }`}
                >
                  <link.Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="rounded-full" icon={<LayoutDashboard className="h-4 w-4" />}>
                    Dashboard
                  </Button>
                </Link>
                <Button variant="danger" size="sm" className="rounded-full" onClick={handleLogout} icon={<LogOut className="h-4 w-4" />}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="primary" size="sm" className="rounded-full" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                    Book now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="animate-slide-down border-t border-slate-200/80 bg-white/95 py-2 backdrop-blur md:hidden dark:border-slate-700/60 dark:bg-slate-900/95">
            <div className="space-y-1.5 px-1 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.path) || (link.path === '/services' && location.pathname.startsWith('/services'))
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/25 dark:text-primary-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <link.Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}

              <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-800/50">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Popular specialties
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {services.slice(0, 6).map((service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.id}`}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-white hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <service.Icon className="h-4 w-4 shrink-0" />
                      {service.label}
                    </Link>
                  ))}
                </div>
                <Link
                  to="/services"
                  className="mt-2.5 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-300"
                >
                  View all services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-2 border-t border-slate-200/80 px-1 pt-3 dark:border-slate-700/60">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <LogIn className="h-5 w-5" /> Sign in
                    </Link>
                    <Link
                      to="/doctors"
                      className="flex items-center gap-3 rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
                    >
                      <UserPlus className="h-5 w-5" /> Book an appointment
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
