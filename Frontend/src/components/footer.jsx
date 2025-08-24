import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useNavigate } from "react-router-dom";
import SimpleFAQChatbot from "./chat";

export default function Footer() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <footer
      className={`w-full transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-purple-900 text-white"
      }`}
    >
      {/** chatbot */}
      <SimpleFAQChatbot isDarkMode={isDarkMode} />
      <div className="container mx-auto px-8 sm:px-12 md:px-16 py-16">
        {/* --- Call to Action Section --- */}
        <div className="text-center pb-16">
          <h2
            className={`text-4xl font-extrabold mb-6 transition-colors duration-300 ${
              isDarkMode ? "text-gray-100" : "text-white"
            }`}
          >
            Don't Miss a Moment on Campus!
          </h2>
          <button
            className={`px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg ${
              isDarkMode
                ? "bg-gray-100 text-gray-900 hover:bg-white"
                : "bg-white text-purple-700 hover:bg-purple-100"
            }`}
          >
            Join Now &rarr;
          </button>
        </div>

        {/* --- Main Footer Content --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* About Section */}
          <div className="max-w-md">
            <h3
              className={`text-5xl font-extrabold mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-gray-100" : "text-white"
              }`}
            >
              Eventify
            </h3>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-purple-200"
              }`}
            >
              The intuitive event platform for fast-growing universities.
              Automate your events with our management tools, registration
              templates, and attendance tracking.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-gray-100" : "text-white"
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li onClick={() => navigate("/")}>
                <a
                  href="#"
                  className={`transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  Home
                </a>
              </li>
              <li onClick={() => navigate("/about")}>
                <a
                  href="#"
                  className={`transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  About Us
                </a>
              </li>
              <li onClick={() => navigate("/events")}>
                <a
                  href="#"
                  className={`transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? "text-gray-100" : "text-white"
              }`}
            >
              Follow Us
            </h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className={`transform hover:scale-110 transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className={`transform hover:scale-110 transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className={`transform hover:scale-110 transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className={`transform hover:scale-110 transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                <Linkedin size={24} />
              </a>
            </div>
            <div
              className={`space-y-3 transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-purple-200"
              }`}
            >
              <div className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0" />
                <a
                  href="mailto:contact@eventify.com"
                  className={`transition-colors duration-200 ${
                    isDarkMode ? "hover:text-gray-100" : "hover:text-white"
                  }`}
                >
                  contact@eventify.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-16 pt-8 border-t flex flex-col sm:flex-row sm:justify-between text-sm transition-colors duration-300 ${
            isDarkMode
              ? "border-gray-700 text-gray-400"
              : "border-purple-700 text-purple-300"
          }`}
        >
          <p>
            &copy; {new Date().getFullYear()} Eventify, Inc. All rights
            reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a
              href="#"
              className={`transition-colors duration-200 ${
                isDarkMode ? "hover:text-gray-100" : "hover:text-white"
              }`}
            >
              Terms & Conditions
            </a>
            <a
              href="#"
              className={`transition-colors duration-200 ${
                isDarkMode ? "hover:text-gray-100" : "hover:text-white"
              }`}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
