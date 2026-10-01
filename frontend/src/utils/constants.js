export const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'Psychiatry',
  'Dentistry',
  'General Medicine',
  'Urology',
  'Nephrology',
  'Oncology'
];

export const AVAILABILITY_OPTIONS = ['All', 'Available Today', 'This Week', 'Next Week'];
export const RATING_OPTIONS = ['All', '4.5+', '4.0+', '3.5+'];
export const EXPERIENCE_RANGES = ['0-5', '5-10', '10-15', '15+'];

export const PAYMENT_METHODS = ['eSewa', 'Khalti', 'ConnectIPS', 'Bank Transfer'];

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Clinic Management System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim();
const isBrowser = typeof window !== 'undefined';
const browserOrigin =
  isBrowser && window.location && window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : '';

let baseApiHost;
if (configuredApiUrl) {
  baseApiHost = configuredApiUrl;
} else if (import.meta.env.PROD && browserOrigin) {
  baseApiHost = browserOrigin;
} else if (import.meta.env.DEV) {
  baseApiHost = 'http://localhost:4000';
} else {
  baseApiHost = browserOrigin || '';
}

export const API_URL = `${baseApiHost.replace(/\/$/, '')}/api`;
export const API_BASE_URL = baseApiHost.replace(/\/$/, '');

export const SERVICES = [
  {
    id: 'cardiology',
    path: '/services/cardiology',
    label: 'Cardiology',
    icon: '❤️',
    description: 'Heart care and treatment'
  },
  {
    id: 'dermatology',
    path: '/services/dermatology',
    label: 'Dermatology',
    icon: '🧴',
    description: 'Skin care and treatment'
  },
  {
    id: 'neurology',
    path: '/services/neurology',
    label: 'Neurology',
    icon: '🧠',
    description: 'Brain and nervous system'
  },
  {
    id: 'pediatrics',
    path: '/services/pediatrics',
    label: 'Pediatrics',
    icon: '👶',
    description: 'Child healthcare'
  },
  {
    id: 'orthopedics',
    path: '/services/orthopedics',
    label: 'Orthopedics',
    icon: '🦴',
    description: 'Bone and joint care'
  },
  {
    id: 'gynecology',
    path: '/services/gynecology',
    label: 'Gynecology',
    icon: '🌸',
    description: 'Women\'s health'
  },
  {
    id: 'ophthalmology',
    path: '/services/ophthalmology',
    label: 'Ophthalmology',
    icon: '👁️',
    description: 'Eye care and surgery'
  },
  {
    id: 'ent',
    path: '/services/ent',
    label: 'ENT',
    icon: '👂',
    description: 'Ear, nose, throat care'
  },
  {
    id: 'psychiatry',
    path: '/services/psychiatry',
    label: 'Psychiatry',
    icon: '🧘',
    description: 'Mental health services'
  },
  {
    id: 'dentistry',
    path: '/services/dentistry',
    label: 'Dentistry',
    icon: '🦷',
    description: 'Dental care and treatment'
  }
];