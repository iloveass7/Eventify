import React from "react";
import { useTheme } from "../components/ThemeContext";
import DarkModeToggle from "../components/DarkModeToggle";
import Hero from "../components/Hero";
import Sponsors from "../components/Sponsors";
import RecommendedEvents from "../components/RecommendedEvents";
import UpcomingEvents from "../components/UpcomingEvents";

const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative transition-all duration-700 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-white"
      }`}
    >
      {/* Global Dark Mode Toggle - Will float on all pages */}
      <DarkModeToggle />

      {/* Pass isDarkMode to components that need it */}
      <div className={isDarkMode ? "dark" : ""}>
        <Hero isDarkMode={isDarkMode} />
        <UpcomingEvents isDarkMode={isDarkMode} />
        <RecommendedEvents isDarkMode={isDarkMode} />
        <Sponsors isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Home;
