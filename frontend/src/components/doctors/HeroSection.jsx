import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-[url('/src/assets/images/pattern.svg')] opacity-10" />
      
      <div className="container-custom relative py-16 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            Find Your Perfect Doctor
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Book appointments with the best healthcare professionals in Nepal
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">👨‍⚕️ 500+ Doctors</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-white">🏥 50+ Specialties</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <span className="text-white">⭐ 4.8 Avg Rating</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <span className="text-white">📅 1000+ Appointments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;