import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const contactInfo = [
    { icon: '📍', title: 'Address', details: 'Kathmandu, Nepal' },
    { icon: '📞', title: 'Phone', details: '+977-1-444-5678' },
    { icon: '📧', title: 'Email', details: 'info@clinicms.com' },
    { icon: '🕐', title: 'Working Hours', details: 'Mon-Fri: 9:00 AM - 6:00 PM' }
  ];

  return (
    <div className="container-custom py-12 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  className="input"
                  rows="4"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div>
            <Card className="p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {info.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a href="#" className="text-3xl hover:scale-110 transition-transform" aria-label="Facebook">
                  📘
                </a>
                <a href="#" className="text-3xl hover:scale-110 transition-transform" aria-label="Twitter">
                  🐦
                </a>
                <a href="#" className="text-3xl hover:scale-110 transition-transform" aria-label="Instagram">
                  📸
                </a>
                <a href="#" className="text-3xl hover:scale-110 transition-transform" aria-label="LinkedIn">
                  💼
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;