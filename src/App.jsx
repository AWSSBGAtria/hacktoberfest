import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import About from './components/About';
import Tracks from './components/Tracks';
import Rewards from './components/Rewards';
import Schedule from './components/Schedule';
import Venue from './components/Venue';
import Partners from './components/Partners';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f2f2eb] text-[#10201d] flex flex-col font-sans selection:bg-[#e97b77] selection:text-[#10201d]">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Countdown />
        <About />
        <Tracks />
        <Rewards />
        <Schedule />
        <Venue />
        <Partners />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
