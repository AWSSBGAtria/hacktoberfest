import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
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
    <div className="min-h-screen bg-[#080911] text-slate-100 flex flex-col font-sans selection:bg-[#ff007a] selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Highlights />
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
