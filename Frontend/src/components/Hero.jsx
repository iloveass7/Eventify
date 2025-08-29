import React, { useEffect, useRef } from 'react';
import { Star, Calendar, Users, MapPin, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = ({ isDarkMode }) => {
  // Refs for animation elements
  const dashboardRef = useRef(null);
  const profileCardRef = useRef(null);
  const eventListRef = useRef(null);
  const testimonialRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.3, rootMargin: '0px' };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target === dashboardRef.current) entry.target.classList.add('animate-float');
        else if (entry.target === profileCardRef.current) entry.target.classList.add('animate-bounce-in');
        else if (entry.target === eventListRef.current) entry.target.classList.add('animate-slide-in-left');
        else if (entry.target === testimonialRef.current) entry.target.classList.add('animate-fade-in');
        else if (entry.target === pieChartRef.current) entry.target.classList.add('animate-pulse-glow');
      });
    }, observerOptions);

    [dashboardRef, profileCardRef, eventListRef, testimonialRef, pieChartRef].forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`h-auto lg:h-auto md:h-auto sm:h-auto relative shadow-2xl overflow-hidden transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {/* Background with solid colors for dark/light mode */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDarkMode
            ? 'bg-gray-900'
            : 'bg-white'
        }`}
      >
        {/* Main large flowing organic shapes with improved blending */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <svg viewBox="0 0 1600 800" preserveAspectRatio="none" className="w-full h-full">
            {/* Large organic blob on the right - softer edges */}
            <path
              d="M800,0 Q1000,50 1200,150 Q1400,300 1300,450 Q1200,600 1000,650 Q800,600 700,450 Q600,300 700,150 Q800,50 800,0 Z"
              fill={isDarkMode ? '#4C1D95' : '#E8D5F2'}
              opacity="0.5"
              filter="url(#blur)"
            />

            {/* Balanced top-left shape */}
            <path
              d="M0,0 Q200,80 400,100 Q600,120 500,250 Q400,350 250,300 Q100,220 0,100 Z"
              fill={isDarkMode ? '#5B21B6' : '#F3E8FF'}
              opacity="0.4"
            />

            {/* Bottom curved wave — more subtle */}
            <path
              d="M-200,600 
                Q200,500 600,550 
                Q1000,600 1400,500 
                Q1800,400 2000,550 
                L2000,800 L-200,800 Z"
              fill={isDarkMode ? '#6D28D9' : '#8B5CF6'}
              opacity="0.3"
            />

            {/* Floating middle blob - reduced opacity */}
            <path
              d="M600,250 Q800,200 1000,280 Q1100,400 900,450 Q700,420 650,350 Q600,280 600,250 Z"
              fill={isDarkMode ? '#4C1D95' : '#E8D5F2'}
              opacity="0.2"
            />

            {/* Small scattered shapes - moved away from edges */}
            <path
              d="M400,320 Q480,270 560,320 Q540,380 460,390 Q400,360 400,320 Z"
              fill={isDarkMode ? '#5B21B6' : '#F3E8FF'}
              opacity="0.3"
            />

            <path
              d="M1000,200 Q1080,180 1120,240 Q1100,300 1040,310 Q980,280 1000,200 Z"
              fill={isDarkMode ? '#6D28D9' : '#D1C0EC'}
              opacity="0.4"
            />

            {/* Gentle wave lines - softer */}
            <path
              d="M100,400 Q500,350 900,400 Q1300,450 1700,400"
              stroke={isDarkMode ? '#8B5CF6' : '#C084FC'}
              strokeWidth="1.5"
              fill="none"
              opacity="0.2"
            />

            <path
              d="M50,150 Q500,120 950,150 Q1400,180 1850,150"
              stroke={isDarkMode ? '#A78BFA' : '#B794F6'}
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />

            {/* Blur filter for smoother edges */}
            <defs>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Full left side bottom shape with better gradient integration */}
        {/* ↓ toned down to avoid visible band below hero */}
        <div className="absolute bottom-0 left-0 w-full h-2/3 opacity-15">
          <svg viewBox="0 0 1600 1200" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,1200 
                Q400,1000 800,1100 
                Q1200,1150 1600,1000 
                L1600,1200 L0,1200 Z"
              fill={isDarkMode ? '#7C3AED' : '#8B5CF6'}
              opacity="0.18"
            />
            <path
              d="M0,800 
                Q300,700 600,750 
                Q900,800 1200,750 
                Q1500,700 1600,750 
                L1600,1200 L0,1200 Z"
              fill={isDarkMode ? '#8B5CF6' : '#7E22CE'}
              opacity="0.12"
            />
            <path
              d="M0,400 Q200,350 400,400 Q600,450 800,400 Q1000,350 1200,400 L1200,1200 L0,1200 Z"
              fill={isDarkMode ? '#4C1D95' : '#E8D5F2'}
              opacity="0.10"
            />
          </svg>
        </div>

        {/* Bottom waves for texture - reduced opacity/strength */}
        <div className="absolute bottom-0 left-0 w-full h-1/4 opacity-10">
          <svg viewBox="0 0 2000 400" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,200 Q400,150 800,200 Q1200,250 1600,200 Q2000,150 2400,200 L2400,400 L0,400 Z"
              fill={isDarkMode ? '#6D28D9' : '#D1C0EC'}
              opacity="0.18"
            />
            <path
              d="M0,300 Q500,250 1000,300 Q1500,350 2000,300 L2000,400 L0,400 Z"
              fill={isDarkMode ? '#8B5CF6' : '#A855F7'}
              opacity="0.10"
            />
          </svg>
        </div>

        {/* Right overlay shapes - reduced opacity and size */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <svg viewBox="0 0 800 800" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M300,0 Q500,100 650,200 Q750,350 700,500 Q600,650 450,700 Q350,650 400,500 Q450,350 500,200 Q400,100 300,0 Z"
              fill={isDarkMode ? '#4C1D95' : '#E8D5F2'}
              opacity="0.3"
            />
            <path
              d="M0,300 Q150,250 300,320 Q450,390 600,320 Q700,250 800,300 L800,0 L0,0 Z"
              fill={isDarkMode ? '#5B21B6' : '#F3E8FF'}
              opacity="0.2"
            />
          </svg>
        </div>

        {/* Circular organic elements */}
        <div className="absolute top-40 right-40 w-64 h-64 opacity-15">
          <svg viewBox="0 0 320 320" className="w-full h-full">
            <path
              d="M160,20 Q220,40 280,80 Q300,140 280,200 Q220,260 160,280 Q100,260 40,200 Q20,140 40,80 Q100,40 160,20 Z"
              stroke={isDarkMode ? '#8B5CF6' : '#C084FC'}
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M160,60 Q200,70 240,100 Q260,140 240,180 Q200,220 160,240 Q120,220 80,180 Q60,140 80,100 Q120,70 160,60 Z"
              stroke={isDarkMode ? '#A78BFA' : '#B794F6'}
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M160,100 Q180,110 200,130 Q210,150 200,170 Q180,190 160,200 Q140,190 120,170 Q110,150 120,130 Q140,110 160,100 Z"
              stroke={isDarkMode ? '#C4B5FD' : '#A78BFA'}
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Soft gradient overlay to blend everything together */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDarkMode ? 'bg-gradient-to-r from-transparent via-gray-900/10 to-transparent' : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
          }`}
        />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(2deg); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3) translateX(20px) rotate(-6deg); }
          50% { opacity: 0.9; transform: scale(1.05) translateX(0px) rotate(-6deg); }
          70% { transform: scale(0.9) rotate(-6deg); }
          100% { opacity: 1; transform: scale(1) rotate(-6deg); }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-30px) rotate(3deg); }
          100% { opacity: 1; transform: translateX(0) rotate(3deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px) rotate(6deg); }
          100% { opacity: 1; transform: translateY(0) rotate(6deg); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-in { animation: bounceIn 1s ease-out forwards; opacity: 0; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; opacity: 0; animation-delay: 0.5s; }
        .animate-pulse-glow { animation: pulseGlow 2s infinite; }
        .counter { transition: all 1s ease-out; }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-auto overflow-y-auto">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <h1
                className={`text-5xl lg:text-6xl font-bold leading-tight mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                The intuitive event platform for fast-growing
                <span className="text-purple-400"> universities</span>
              </h1>

              <p
                className={`text-xl mb-8 leading-relaxed transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Automate your events with Eventify's management tools, registration templates, attendance tracking, and scalable event platform.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-4 mb-8 ">
                <div
                  className={`flex items-center rounded-full px-4 py-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                  <span
                    className={`text-lg font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Create events in minutes
                  </span>
                </div>

                <div
                  className={`flex items-center rounded-full px-4 py-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 text-purple-400 mr-2" />
                  <span
                    className={`text-lg font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Keep attendance clean
                  </span>
                </div>

                <div
                  className={`flex items-center rounded-full px-4 py-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <Award className="w-5 h-5 text-purple-400 mr-2" />
                  <span
                    className={`text-lg font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Engage with all students
                  </span>
                </div>

                                <div
                  className={`flex items-center rounded-full px-4 py-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <Award className="w-5 h-5 text-purple-400 mr-2" />
                  <span
                    className={`text-lg font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Engage with all students
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Join Now
                </Link>
              </div>
            </div>

            {/* Right Content - Dashboard Mockup */}
            <div className="relative">
              {/* Main Dashboard Card */}
              <div
                ref={dashboardRef}
                className={`relative rounded-2xl shadow-2xl p-6 transform rotate-2 transition-all duration-300 hover:rotate-0 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">👤</span>
                    </div>
                    <div>
                      <div className={`font-semibold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Club Admin
                      </div>
                      <div className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Event organizer at your university
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Chart */}
                <div className="mb-6">
                  <h3 className={`font-semibold mb-3 transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Event Analytics
                  </h3>
                  <div className="relative">
                    {/* Pie Chart Simulation */}
                    <div ref={pieChartRef} className="w-32 h-32 mx-auto relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                      <div className="absolute inset-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                      <div className="absolute inset-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"></div>
                      <div className="absolute inset-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                      <div
                        className={`absolute inset-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                      >
                        <span className={`text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>85%</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold counter transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        10,347,000
                      </div>
                      <div className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold counter transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        25,871,804
                      </div>
                      <div className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Registrations</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold counter transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>$3,200,000</div>
                      <div className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold counter transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>98,4351</div>
                      <div className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Attendees</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Profile Card */}
              <div
                ref={profileCardRef}
                className={`absolute -top-4 -right-4 rounded-xl shadow-lg p-4 transform -rotate-6 transition-all duration-300 hover:-rotate-3 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">👩</span>
                  </div>
                  <div>
                    <div className={`font-semibold text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Sarah Chen
                    </div>
                    <div className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Computer Science Club</div>
                  </div>
                </div>
              </div>

              {/* Event List Card */}
              <div
                ref={eventListRef}
                className={`absolute -bottom-6 -left-6 rounded-xl shadow-lg p-4 transform rotate-3 transition-all duration-300 hover:rotate-1 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`text-sm font-semibold mb-3 transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Upcoming Events
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tech Symposium</span>
                  </div>
                  <div className="flex items-center space-x-2 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Career Fair</span>
                  </div>
                  <div className="flex items-center space-x-2 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Workshop Series</span>
                  </div>
                  <div className="flex items-center space-x-2 transition-transform duration-300 hover:translate-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className={`text-xs transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Networking Night</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Card */}
              <div
                ref={testimonialRef}
                className={`absolute top-1/2 -right-8 rounded-xl shadow-lg p-4 max-w-xs transform rotate-6 transition-all duration-300 hover:rotate-3 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-30 h-10 bg-gradient-to-r from-purple-400 to-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">👨</span>
                  </div>
                  <div>
                    <p className={`text-xs mb-2 transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      "Having all our options around event management in one place is amazing. We used to be good to be able to track attendance properly."
                    </p>
                    <div className={`text-xs font-semibold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Marcus, CS Student & Event Coord
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Right Content */}
          </div>
        </div>

        {/* Additional Background Decorations */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 opacity-20">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            <circle cx="80" cy="80" r="70" stroke={isDarkMode ? '#6D28D9' : '#D1C0EC'} strokeWidth="1.5" fill="none" opacity="0.4" />
            <circle cx="80" cy="80" r="45" stroke={isDarkMode ? '#4C1D95' : '#E8D5F2'} strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>

        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 opacity-25">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="50" stroke={isDarkMode ? '#8B5CF6' : '#C084FC'} strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        </div>

        <div className="absolute top-1/2 right-10 w-20 h-20 opacity-30">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <circle cx="40" cy="40" r="35" stroke="#A78BFA" strokeWidth="0.5" fill="none" opacity="0.7" />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default Hero;