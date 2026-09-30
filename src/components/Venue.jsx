import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { MapPin, Navigation, Calendar, CheckCircle, Wifi, TrainFront, Landmark, CarFront, CircleDot, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import VenueMap from './VenueMap';

export default function Venue() {
  const checklist = [
    'Laptop & Charger (mandatory for hands-on hacking)',
    'Valid College / University Student ID Card',
    'Active GitHub account (ready to submit PRs)',
    'Joined the official WhatsApp group for live event updates',
  ];

  // Grounded October 2026: no metro station is open in Hebbal yet (the Blue
  // Line stop is still under construction). Bus numbers below are BMTC routes
  // verified against current timetables - reconfirm on the BMTC app before
  // leaving, since numbers and frequency change.
  const travel = [
    {
      icon: TrainFront,
      title: 'Nearest metro',
      body: 'No metro station is open in Hebbal yet, so every trip ends on the road. Yeshwanthpur (Green Line), Sandal Soap Factory (Green Line) and Central / Majestic (Purple + Green) are each roughly 7 km out.',
      links: [
        { label: 'Yeshwanthpur Metro', href: 'https://maps.app.goo.gl/PT4UXFqZFFbF9GAZA' },
        { label: 'Central Metro', href: 'https://maps.app.goo.gl/okchxJTCUtviSbhR6' },
      ],
      time: '~25–35 min',
    },
    {
      icon: Landmark,
      title: 'From Majestic',
      body: 'City station to Hebbal is roughly 12 km straight up Bellary Road. Board at Kempegowda Bus Station and get down at Hebbala.',
      links: [{ label: 'Get directions', href: 'https://maps.app.goo.gl/mTL1R8SWty4VFPMdA' }],
      time: '~30–45 min',
    },
    {
      icon: CarFront,
      title: 'From the KR Puram side',
      body: 'Come down via Hennur and Nagavara, about 15 km. It is the longest leg on this list, so leave early.',
      links: [{ label: 'Get directions', href: 'https://maps.app.goo.gl/RuDkyECueMx6v2qK9' }],
      time: '~45–60 min',
    },
    {
      icon: Navigation,
      title: 'From the Yelahanka side',
      body: 'Straight down Bellary Road toward the city, about 8–9 km. Watch for the Atria IT turn-off just before the Hebbal flyover.',
      links: [{ label: 'Get directions', href: 'https://maps.app.goo.gl/5iKqqMtaFAjTTJf5A' }],
      time: '~20–30 min',
    },
    {
      icon: CircleDot,
      title: 'From BEL Circle',
      body: 'Practically next door: about 2–3 km toward Hebbal. An auto takes under ten minutes.',
      links: [{ label: 'Get directions', href: 'https://maps.app.goo.gl/gxcrSv1wf2BCAV7D9' }],
      time: '~10 min',
    },
  ];

  return (
    <section id="venue" className="theme-section theme-dark py-20 sm:py-28 bg-[#211f47] text-[#f7f7f2] border-b-2 border-[#10201d]">
      <div className="shell">
        {/* Intro */}
        <SectionHead
          eyebrow="VENUE & ATTENDEE LOGISTICS"
          title={<>Location &amp;</>}
          accent="what you should bring."
          pacColor="#ff7a1a"
          deck="The event will take place on campus at Atria Institute of Technology in Hebbal, Bengaluru. High-speed Wi-Fi, power ports, lunch, and refreshments are provided."
        />

        {/* Map-led venue layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-8 items-stretch">
          {/* Card 1: Venue Info */}
          <Reveal className="theme-card lg:col-span-1 p-8 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] hover:shadow-[4px_4px_0_#671912] flex flex-col justify-between">
            <div>
              <span className="ht-tag mb-4 inline-block">
                HOST CAMPUS
              </span>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#10201d] mb-4">
                {EVENT_DETAILS.venue.name}
              </h3>

              <div className="p-4 bg-[#e4e5da] border border-[#10201d] font-mono text-xs text-[#10201d] space-y-1 mb-6">
                <p className="font-bold">{EVENT_DETAILS.venue.address}</p>
                <p>{EVENT_DETAILS.venue.city}</p>
                <p>{EVENT_DETAILS.venue.country}</p>
              </div>

              <div className="space-y-3 text-sm text-[#34433f] font-sans mb-8">
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-[#e53927]" />
                  <span>High-speed campus Wi-Fi network available throughout the venue</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#e53927]" />
                  <span>Centrally located in Anandnagar, Hebbal with convenient bus and transit connectivity</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#10201d]/15 flex flex-wrap gap-3">
              <a
                href={EVENT_DETAILS.venue.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ht-btn-primary text-xs py-2 px-4 min-h-[42px]"
              >
                <Navigation className="w-3.5 h-3.5 mr-1.5" />
                Google Maps Directions
              </a>

              <a
                href="https://www.google.com/calendar/render?action=TEMPLATE&text=Hacktoberfest+Hack+Day+Bengaluru+x+AWS+Student+Builder+Group+at+Atria+Institute+of+Technology&dates=20261023T030000Z/20261023T143000Z&details=Hacktoberfest+Hack+Day+at+Atria+IT+Bengaluru.+Register:+https://events.mlh.com/events/15272-hacktoberfest-hack-day-bengaluru-x-aws-student-builder-group-at-atria-institute-of-technology&location=Atria+Institute+of+Technology,+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 font-mono text-xs font-bold border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] hover:bg-[#e4e5da] shadow-[3px_3px_0_#10201d] flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#e53927]" />
                Add to Calendar
              </a>
            </div>
          </Reveal>

          <Reveal delay={90} className="venue-map" aria-label="Map showing Atria Institute of Technology">
            {/* <div className="map-ribbon">
              <span className="map-ribbon-dot" aria-hidden="true" />
              Atria Institute of Technology · Hebbal
            </div>*/}
            {/* Leaflet on OSM tiles with our own red pin: pans and zooms with
                the map, no keys or consent walls. */}
            <VenueMap />
          </Reveal>

          {/* Card 2: Attendee Checklist */}
          <Reveal delay={140} className="theme-card lg:col-span-2 p-8 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] hover:shadow-[4px_4px_0_#671912] flex flex-col justify-between">
            <div>
              <span className="ht-tag mb-4 inline-block">
                WHAT TO BRING
              </span>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#10201d] mb-4">
                Attendee Checklist
              </h3>

              <div className="space-y-4 mb-6">
                {checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#e4e5da] border border-[#10201d] flex items-start gap-3 text-xs sm:text-sm font-mono text-[#10201d]"
                  >
                    <CheckCircle className="w-4 h-4 text-[#e53927] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Getting here from across Bengaluru */}
        <div className="mt-12 sm:mt-16">
          <p className="font-mono text-xs font-bold tracking-[0.08em] uppercase text-[#8bb2de] mb-2">
            Reach the venue · Bengaluru
          </p>
          <h3 className="font-display font-extrabold uppercase tracking-tight text-2xl sm:text-4xl text-[#f7f7f2] mb-3">
            Coming from across the city
          </h3>
          <p className="text-sm sm:text-base text-[#c6caf0] font-sans max-w-[70ch] mb-8">
            Atria IT sits in Anandnagar, Hebbal, right off Bellary Road. Aim to arrive
            by 8:30 AM — autos and cabs surge on event mornings, so leave early.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {travel.map((t, idx) => {
              const Icon = t.icon;
              return (
                <Reveal
                  key={t.title}
                  delay={(idx % 3) * 90}
                  className="theme-card p-6 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] hover:shadow-[4px_4px_0_#671912] flex flex-col gap-3"
                >
                  <span className="w-11 h-11 inline-flex items-center justify-center bg-[#211f47] text-[#f5b726] border-2 border-[#10201d] shadow-[3px_3px_0_#10201d]" aria-hidden="true">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h4 className="font-display font-bold text-lg text-[#10201d] leading-snug">
                    {t.title}
                  </h4>
                  <p className="text-sm text-[#34433f] font-sans leading-relaxed flex-grow">
                    {t.body}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {t.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide border-2 border-[#10201d] bg-[#e4e5da] text-[#10201d] hover:bg-[#f5b726] shadow-[3px_3px_0_#10201d] hover:shadow-[1px_1px_0_#10201d] hover:translate-x-[2px] hover:translate-y-[2px]"
                      >
                        {l.label}
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                  <span className="self-start font-mono text-[11px] font-bold px-2 py-1 bg-[#e4e5da] text-[#10201d] border-2 border-[#10201d]">
                    {t.time}
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
