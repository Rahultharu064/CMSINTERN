import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: '❤️',
      title: 'Cardiology',
      description: 'Comprehensive heart care including diagnosis, treatment, and prevention of cardiovascular diseases.',
      features: ['Heart checkups', 'ECG/EKG', 'Cardiac surgery', 'Rehabilitation'],
      path: '/services/cardiology'
    },
    {
      id: 2,
      icon: '🧴',
      title: 'Dermatology',
      description: 'Expert skin care services for all skin conditions including acne, eczema, and cosmetic procedures.',
      features: ['Skin consultation', 'Acne treatment', 'Laser therapy', 'Cosmetic procedures'],
      path: '/services/dermatology'
    },
    {
      id: 3,
      icon: '🧠',
      title: 'Neurology',
      description: 'Advanced diagnosis and treatment for disorders of the nervous system and brain.',
      features: ['Stroke care', 'Epilepsy treatment', 'Neurological exams', 'Brain surgery'],
      path: '/services/neurology'
    },
    {
      id: 4,
      icon: '👶',
      title: 'Pediatrics',
      description: 'Comprehensive healthcare for children from birth to adolescence.',
      features: ['Well-baby visits', 'Vaccinations', 'Child development', 'Pediatric surgery'],
      path: '/services/pediatrics'
    },
    {
      id: 5,
      icon: '🦴',
      title: 'Orthopedics',
      description: 'Specialized care for bones, joints, ligaments, and musculoskeletal conditions.',
      features: ['Fracture care', 'Joint replacement', 'Sports medicine', 'Physical therapy'],
      path: '/services/orthopedics'
    },
    {
      id: 6,
      icon: '🌸',
      title: 'Gynecology',
      description: 'Comprehensive women\'s health services from adolescence through menopause.',
      features: ['Annual exams', 'Pregnancy care', 'Menopause management', 'Gynecological surgery'],
      path: '/services/gynecology'
    },
    {
      id: 7,
      icon: '👁️',
      title: 'Ophthalmology',
      description: 'Complete eye care services including diagnosis and treatment of eye conditions.',
      features: ['Eye exams', 'Cataract surgery', 'LASIK', 'Glaucoma treatment'],
      path: '/services/ophthalmology'
    },
    {
      id: 8,
      icon: '👂',
      title: 'ENT',
      description: 'Specialized care for ear, nose, and throat conditions.',
      features: ['Hearing tests', 'Sinus treatment', 'Tonsillectomy', 'Balance disorders'],
      path: '/services/ent'
    },
    {
      id: 9,
      icon: '🧘',
      title: 'Psychiatry',
      description: 'Mental health services for depression, anxiety, and other psychiatric conditions.',
      features: ['Mental health evaluation', 'Therapy', 'Medication management', 'Crisis intervention'],
      path: '/services/psychiatry'
    },
    {
      id: 10,
      icon: '🦷',
      title: 'Dentistry',
      description: 'Complete dental care including preventive, restorative, and cosmetic dentistry.',
      features: ['Cleanings', 'Fillings', 'Root canals', 'Orthodontics'],
      path: '/services/dentistry'
    },
    {
      id: 11,
      icon: '💊',
      title: 'Pharmacy',
      description: 'Full-service pharmacy with prescription fulfillment and medication counseling.',
      features: ['Prescription filling', 'Medication counseling', 'Delivery service', 'Health products'],
      path: '/services/pharmacy'
    },
    {
      id: 12,
      icon: '🏥',
      title: 'Emergency Care',
      description: '24/7 emergency medical services for urgent and life-threatening conditions.',
      features: ['24/7 availability', 'Trauma care', 'Ambulance service', 'Critical care'],
      path: '/services/emergency'
    }
  ];

  return (
    <div className="container-custom py-12 animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Services
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We offer a wide range of medical services to meet all your healthcare needs.
          Our experienced team is here to provide you with the best care possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {services.map((service) => (
          <Card key={service.id} className="h-full flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {service.features.map((feature, index) => (
                  <span key={index} className="badge badge-info text-xs">
                    {feature}
                  </span>
                ))}
              </div>
              <Link to={service.path}>
                <Button variant="primary" size="sm" fullWidth>
                  Learn More →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="card p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Need Help Choosing a Service?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our team is here to help you find the right service for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" size="lg">
                Find a Doctor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;