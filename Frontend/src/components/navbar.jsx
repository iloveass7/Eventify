import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="text-black w-full py-4 shadow-xs mx-auto">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Eventify</h1>
        {/* Mobile menu button */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </div>
        <ul className="hidden md:flex space-x-4">
          <li>
            <a href="#" className="hover:font-semibold">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:font-semibold">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:font-semibold">
              Events
            </a>
          </li>
        </ul>
        <ul className="hidden md:flex space-x-4">
          <li>
            <a href="#" className="hover:font-semibold">
              Login
            </a>
          </li>
          <li>
            <a href="#" className="hover:font-semibold">
              Sign Up
            </a>
          </li>
        </ul>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden h-screen w-screen z-20 ">
        {isOpen && (
          <div className="flex flex-col space-y-4">
            <a href="#" className="hover:font-semibold">
              About
            </a>
            <a href="#" className="hover:font-semibold">
              Home
            </a>
            <a href="#" className="hover:font-semibold">
              Events
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
