import React from 'react';
import Hero from '../components/Hero';
import Sponsors from '../components/Sponsors';
import RecommendedEvents from '../components/RecommendedEvents';
import UpcomingEvents from '../components/UpcomingEvents';

const Home = () => {
  return (
    <div>
      <Hero />
      <UpcomingEvents />
      <RecommendedEvents />
      <Sponsors />
    </div>
  );
};

export default Home;