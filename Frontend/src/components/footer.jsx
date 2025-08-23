import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white w-full">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 py-16">

        {/* --- Call to Action Section --- */}
        <div className="text-center pb-16">
          <h2 className="text-4xl font-extrabold mb-6">Don't Miss a Moment on Campus!</h2>
          <button className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Join Now &rarr;
          </button>
        </div>

        {/* --- Main Footer Content --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* About Section */}
          <div className="max-w-md">
            <h3 className="text-5xl font-extrabold mb-4">Eventify</h3>
            <p className="text-purple-200 leading-relaxed">
              The intuitive event platform for fast-growing universities. Automate your events with our management tools, registration templates, and attendance tracking.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors duration-200">Events</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-purple-200 hover:text-white transform hover:scale-110 transition-transform duration-200">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-purple-200 hover:text-white transform hover:scale-110 transition-transform duration-200">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-purple-200 hover:text-white transform hover:scale-110 transition-transform duration-200">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-purple-200 hover:text-white transform hover:scale-110 transition-transform duration-200">
                <Linkedin size={24} />
              </a>
            </div>
            <div className="space-y-3 text-purple-200">
                <div className="flex items-center">
                  <Mail size={20} className="mr-3 flex-shrink-0"/>
                  <a href="mailto:contact@eventify.com" className="hover:text-white transition-colors duration-200">
                    contact@eventify.com
                  </a>
                </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-purple-700 flex flex-col sm:flex-row sm:justify-between text-sm text-purple-300">
          <p>&copy; {new Date().getFullYear()} Eventify, Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors duration-200">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
