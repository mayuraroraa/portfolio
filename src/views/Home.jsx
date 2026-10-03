'use client';

import React from 'react';
import HomeHero from '@/components/hero/HomeHero';
import '@/styles/Home.css';

const Home = (props) => {
  return <HomeHero {...props} />;
};

export default Home;