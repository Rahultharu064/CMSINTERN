import React from 'react';
import { Link } from 'react-router-dom';
import  HeroSection  from '../components/doctors/HeroSection.jsx';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home = () => {
  const features = [
    {
      icon: '👨‍⚕️',
      title: 'Expert Doctors',
      description: 'Qualified and experienced healthcare professionals'
    },
    {
      icon: '🏥',
      title: 'Modern Facilities',
      description: 'State-of-the-art equipment and comfortable environment'
    },
    {
      icon: '💳',
      title: 'Easy Payments',
      description: 'Multiple payment options including eSewa and Khalti'
    }
  ];

  const stats = [
    { value: '500+', label: 'Doctors' },
    { value: '50+', label: 'Specialties' },
    { value: '4.8⭐', label: 'Average Rating' },
    { value: '1000+', label: 'Appointments' }
  ];

  return (
    <div>
      <HeroSection />
      
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Why Choose Our Clinic?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive healthcare services with experienced professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/doctors">
            <Button variant="primary" size="lg" icon="→" iconPosition="right">
              Find Your Doctor Now
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📊 Our Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🏆 Why Us</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 text-xl">✓</span>
                <span>24/7 Emergency Services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 text-xl">✓</span>
                <span>Affordable Healthcare</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 text-xl">✓</span>
                <span>Online Appointment Booking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 text-xl">✓</span>
                <span>Insurance Accepted</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;