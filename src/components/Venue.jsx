import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { MapPin, Navigation, Calendar, CheckCircle, Wifi } from 'lucide-react';

export default function Venue() {
  const checklist = [
    'Laptop & Charger (mandatory for hands-on hacking)',
    'Valid College / University Student ID Card',
    'Active GitHub account (ready to submit PRs)',
    'Joined the official WhatsApp group for live event updates',
  ];

  return (
    <section id="venue" className="py-20 sm:py-28 bg-[#2e4742] text-[#f7f7f2] border-b-2 border-[#10201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-bold text-[#8bb2de] uppercase tracking-[0.08em] mb-3">
              VENUE & ATTENDEE LOGISTICS
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.94] text-[#f7f7f2] uppercase">
              Location & <br />
              <em className="text-[#f5b726] not-italic font-normal font-sans italic lowercase">
                what you should bring.
              </em>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
            The event will take place on campus at Atria Institute of Technology in Hebbal, Bengaluru. High-speed Wi-Fi, power ports, lunch, and refreshments are provided.
          </p>
        </div>

        {/* 2 Column Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Venue Info */}
          <div className="p-8 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] flex flex-col justify-between">
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
                href="https://www.google.com/calendar/render?action=TEMPLATE&text=Hacktoberfest+Hack+Day+Bengaluru+x+AWS+Student+Builder+Group+at+Atria+Institute+of+Technology&dates=20261030T030000Z/20261030T143000Z&details=Hacktoberfest+Hack+Day+at+Atria+IT+Bengaluru.+Register:+https://events.mlh.com/events/15272-hacktoberfest-hack-day-bengaluru-x-aws-student-builder-group-at-atria-institute-of-technology&location=Atria+Institute+of+Technology,+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 font-mono text-xs font-bold border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] hover:bg-[#e4e5da] shadow-[3px_3px_0_#10201d] flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#e53927]" />
                Add to Calendar
              </a>
            </div>
          </div>

          {/* Card 2: Attendee Checklist */}
          <div className="p-8 bg-[#f7f7f2] text-[#10201d] border-2 border-[#10201d] shadow-[7px_7px_0_#671912] flex flex-col justify-between">
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

            <div className="p-4 bg-[#f5b726] border-2 border-[#10201d] text-[#10201d] font-mono text-xs">
              <strong>💡 Builder Pro-Tip:</strong> Install Git on your laptop beforehand and verify that your GitHub SSH/HTTPS credentials are configured.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
