import React from 'react';
import { Sparkles, Heart, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Floating Bubbles */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16 sm:py-20 md:py-24 lg:py-24">
        {/* Floating Bubbles Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const isAmber = i % 3 === 0; // Every third bubble is amber
            const size = Math.random() * 60 + 20;
            return (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3, // Increased opacity
                  background: isAmber 
                    ? `radial-gradient(circle, rgba(251,191,36,0.7) 0%, rgba(245,158,11,0.5) 70%, transparent 100%)`
                    : `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 70%, transparent 100%)`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 15 + 10}s`,
                  filter: 'blur(1px)',
                  boxShadow: isAmber 
                    ? '0 0 15px rgba(251, 191, 36, 0.6)'
                    : '0 0 15px rgba(255, 255, 255, 0.6)'
                }}
              />
            );
          })}
        </div>
        
        <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 text-center max-w-3xl lg:container lg:mx-auto lg:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 leading-tight">
            Creating Unforgettable <span className="text-amber-400">Experiences</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mx-auto font-light opacity-90">
            Where every event becomes a cherished memory, and every moment matters
          </p>
        </div>

        {/* Animation CSS */}
        <style jsx>{`
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg) scale(1);
              opacity: 0.4;
            }
            33% {
              transform: translateY(-30px) rotate(120deg) scale(1.05);
              opacity: 0.6;
            }
            66% {
              transform: translateY(-60px) rotate(240deg) scale(1.1);
              opacity: 0.5;
            }
            100% {
              transform: translateY(-90px) rotate(360deg) scale(1);
              opacity: 0.3;
            }
          }
          .animate-float {
            animation: float 20s infinite ease-in-out;
          }
        `}</style>
      </div>

      {/* Our Story */}
      <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-20 lg:mx-31 lg:max-w-10xl">
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
          <div className="md:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 sm:h-80 md:h-96 lg:h-150 w-auto">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Our team organizing events"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-4 sm:left-5 md:left-6 text-white">
                <p className="text-sm sm:text-base md:text-lg font-light">Since 2018</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium">Where it all began</h3>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 leading-tight">
              More than event planning — we're your <span className="text-purple-600">experience partners</span>
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg md:text-[1.3rem] leading-relaxed">
              Born from a vision to revolutionize how universities and organizations connect with their communities, Eventify has transformed from a simple idea into a comprehensive event management platform. What started as helping a few local clubs organize their events has grown into empowering thousands of institutions worldwide.
            </p>
            <p className="text-gray-600 text-base sm:text-lg md:text-[1.3rem] leading-relaxed">
              Every feature we build is crafted with real event organizers in mind, every tool is tested by actual communities, and every update is driven by genuine feedback. We believe event management should be intuitive, powerful, and accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 pt-8 pb-14 sm:pt-10 sm:pb-16 md:pt-12 md:pb-20 lg:py-8 lg:pb-20">
        <div className="px-4 sm:px-6 md:px-8 lg:px-5 lg:mx-35 lg:max-w-8xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="inline-block px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-4 my-3 sm:my-4 md:my-5 text-sm sm:text-base md:text-xl bg-purple-100 text-purple-700 rounded-full font-medium mb-3 sm:mb-4">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">Values that drive us</h2>
            <p className="text-gray-500 text-base sm:text-lg md:text-[1.3rem] mx-auto max-w-2xl sm:max-w-3xl">
              These core principles shape how we build technology and serve our community
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-14">
            {[
              {
                icon: <Sparkles className="text-purple-600" size={28} />,
                title: 'Seamless Experiences',
                desc: 'We design intuitive tools that make event planning effortless and enjoyable for organizers of all skill levels.'
              },
              {
                icon: <Heart className="text-purple-600" size={28} />,
                title: 'Community First',
                desc: 'Every university, club, and organization deserves powerful event management tools that bring people together.'
              },
              {
                icon: <Shield className="text-purple-600" size={28} />,
                title: 'Reliable Platform',
                desc: 'Rock-solid infrastructure, data security, and 24/7 support ensure your events run smoothly every time.'
              }
            ].map((value, index) => (
              <div key={index} className="flex justify-center">
                <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:bg-purple-200 mb-6 sm:mb-8 md:mb-10 lg:mb-13">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base md:text-xl">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;