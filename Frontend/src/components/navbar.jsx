import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-purple-900 text-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-8xl mx-auto px-6 md:px-24 lg:px-25 py-6 flex items-center">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <h1 className="text-[3.1rem] font-extrabold">Eventify</h1>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex flex-1 justify-center gap-10 text-lg font-semibold lg:text-[1.4rem]">
          <li>
            <a href="#" className="hover:text-purple-300 transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-purple-300 transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-purple-300 transition-colors">
              Events
            </a>
          </li>
        </ul>

        {/* Right-side Actions - Login/Register Links */}
        <div className="flex-1 flex justify-end items-center gap-6 md:gap-6 lg:gap-10">
          <ul className="hidden md:flex space-x-6 text-lg font-semibold lg:text-[1.4rem]">
            <li>
              <a href="#" className="hover:text-purple-300 transition-colors">
                Login
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-300 transition-colors">
                Sign Up
              </a>
            </li>
          </ul>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pt-8 pb-10 bg-purple-900">
          <ul className="flex flex-col gap-6 text-2xl font-semibold">
            <li>
              <a href="#" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition-colors">
                Events
              </a>
            </li>
            <li className="pt-4 border-t border-purple-700">
              <a href="#" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition-colors">
                Login
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition-colors">
                Sign Up
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}