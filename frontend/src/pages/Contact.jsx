import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Facebook, Twitter, Instagram, Linkedin } from '../components/ui/SocialIcons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const contactInfo = [
  { Icon: MapPin, title: 'Address', details: 'Chabahil, Kathmandu, Nepal' },
  { Icon: Phone, title: 'Phone', details: '+977-1-444-5678' },
  { Icon: Mail, title: 'Email', details: 'info@clinicms.com' },
  { Icon: Clock, title: 'Working hours', details: 'Sun–Fri: 9:00 AM – 6:00 PM' },
];

const socials = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Linkedin, label: 'LinkedIn' },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="container-custom animate-fade-in-up py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="eyebrow justify-center">Contact us</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            We’re here to help.
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Have questions? We’d love to hear from you. Send us a message and we’ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card hoverable={false}>
            <h3 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">Send a message</h3>

            {submitted && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                Thanks — your message has been sent. We’ll be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email address"
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  className="input"
                  rows="4"
                  placeholder="Your message…"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth icon={<Send className="h-5 w-5" />}>
                Send message
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card hoverable={false}>
              <h3 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">Contact information</h3>
              <div className="space-y-3">
                {contactInfo.map(({ Icon, title, details }) => (
                  <div key={title} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-slate-700 dark:text-primary-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card hoverable={false}>
              <h3 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">Follow us</h3>
              <div className="flex gap-3">
                {socials.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-primary-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
