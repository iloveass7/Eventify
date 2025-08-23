import React from 'react';
import Hero from '../components/Hero';
import Sponsors from '../components/Sponsors';
import RecommendedEvents from '../components/RecommendedEvents';

const Home = () => {
  return (
    <div>
      <Hero />
      <Sponsors />
      <RecommendedEvents />
    </div>
  );
};

export default Home;