import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
{ path:' services', label:'services'},
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
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main Footer */}
      <div className="container-custom pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🏥</span> ClinicMS
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted healthcare partner in Nepal. Book appointments with the best doctors 
              and receive quality medical care at affordable prices.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-110 transition-transform duration-300 hover:text-primary-400"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2"
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
            <h4 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">
              Payment Methods
            </h4>
            <ul className="space-y-2.5">
              {paymentMethods.map((method) => (
                <li key={method.name} className="flex items-center gap-3 text-gray-400 text-sm">
                  <span className="text-xl">{method.icon}</span>
                  {method.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">
                🔒 Secure payments with industry-standard encryption
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-400 text-sm">
                  <span className="text-xl flex-shrink-0">{info.icon}</span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📬</span>
              <div>
                <p className="text-sm font-medium text-white">Subscribe to our Newsletter</p>
                <p className="text-xs text-gray-400">Get health tips and updates</p>
              </div>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-sm bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary-500 flex-1 md:w-64"
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-400 text-center md:text-left">
              © {currentYear} Clinic Management System. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="w-px h-4 bg-gray-700"></span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="w-px h-4 bg-gray-700"></span>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
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