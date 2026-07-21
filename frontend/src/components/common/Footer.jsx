import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Service' },
  ];

  const paymentMethods = [
    { name: 'eSewa', icon: '💳' },
    { name: 'Khalti', icon: '💳' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'YouTube', icon: '▶️', url: '#' },
  ];

  const contactInfo = [
    { icon: '📍', text: 'Kathmandu, Nepal' },
    { icon: '📞', text: '+977-1-444-5678' },
    { icon: '📧', text: 'info@clinicms.com' },
    { icon: '🕐', text: 'Mon-Fri: 9:00 AM - 6:00 PM' },
  ];

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white">
      {/* Main Footer */}
      <div className="container-custom pt-12 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <span className="text-2xl">🏥</span> ClinicMS
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted healthcare partner in Nepal. Book appointments with the best doctors and receive quality medical care at affordable prices.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl transition-transform duration-300 hover:scale-110 hover:text-primary-400"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="text-primary-400">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Payment Methods
            </h4>
            <ul className="space-y-2.5">
              {paymentMethods.map((method) => (
                <li key={method.name} className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="text-xl">{method.icon}</span>
                  {method.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <p className="text-xs text-slate-400">
                🔒 Secure payments with industry-standard encryption
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="flex-shrink-0 text-xl">{info.icon}</span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-400 transition-colors hover:text-primary-300"
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-8 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📬</span>
              <div>
                <p className="text-sm font-medium text-white">Subscribe to our newsletter</p>
                <p className="text-xs text-slate-400">Get health tips and updates</p>
              </div>
            </div>
            <form className="flex w-full gap-2 md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-sm flex-1 border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:border-primary-500 md:w-64"
              />
              <button type="submit" className="btn btn-primary btn-sm whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-4">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className="text-center text-slate-400 md:text-left">
              © {currentYear} Clinic Management System. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link to="/privacy" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <span className="h-4 w-px bg-slate-700"></span>
              <Link to="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
              <span className="h-4 w-px bg-slate-700"></span>
              <Link to="/sitemap" className="transition-colors hover:text-white">
                Sitemap
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>⚡</span>
              <span>Made with ❤️ in Nepal</span>
              <span className="hidden sm:inline">| v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;