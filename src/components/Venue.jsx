import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { MapPin, Navigation, Calendar, CheckCircle, Wifi, Lightbulb, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

export default function Venue() {
  const checklist = [
    'Laptop & Charger (mandatory for hands-on hacking)',
    'Valid College / University Student ID Card',
    'Active GitHub account (ready to submit PRs)',
    'Joined the official WhatsApp group for live event updates',
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
            <div className="map-ribbon">
              <span className="map-ribbon-dot" aria-hidden="true" />
              Atria Institute of Technology · Hebbal
            </div>
            {/* bbox is symmetric around the venue with OSM's own marker removed,
                so our pin sits exactly on the building at the frame's centre. */}
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.58803%2C13.029816%2C77.59483%2C13.035616&layer=mapnik"
              title="OpenStreetMap showing Atria Institute of Technology"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <span className="map-pin" aria-hidden="true">
              <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17 43C17 43 32 26.4 32 16.5A15 15 0 1 0 2 16.5C2 26.4 17 43 17 43Z"
                  fill="#e53927"
                  stroke="#10201d"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle cx="17" cy="16.5" r="5.5" fill="#f7f7f2" stroke="#10201d" strokeWidth="2.5" />
              </svg>
            </span>
            <a className="map-credit inline-flex items-center gap-1" href="https://www.openstreetmap.org/?mlat=13.032716&mlon=77.59143#map=17/13.032716/77.59143" target="_blank" rel="noopener noreferrer">
              Open in OpenStreetMap <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </a>
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

            <div className="p-4 bg-[#f5b726] border-2 border-[#10201d] text-[#10201d] font-mono text-xs flex items-start gap-2">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>Builder Pro-Tip:</strong> Install Git on your laptop beforehand and verify that your GitHub SSH/HTTPS credentials are configured.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
