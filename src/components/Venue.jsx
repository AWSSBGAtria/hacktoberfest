import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { MapPin, Navigation, CalendarPlus, Laptop, Wifi, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Venue() {
  const checklist = [
    { text: 'Laptop & Charger (mandatory)', icon: Laptop },
    { text: 'Valid College / University Student ID', icon: CheckCircle2 },
    { text: 'GitHub Account (ready to fork & commit)', icon: CheckCircle2 },
    { text: 'Joined the Official WhatsApp Group', icon: CheckCircle2 },
  ];

  return (
    <section id="venue" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>VENUE & LOGISTICS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Location & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#00f0ff] to-[#8b5cf6]">
              Attendee Checklist.
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-lg">
            Join us in the vibrant tech hub of Bengaluru at Atria Institute of Technology in Hebbal for a full day of hacking.
          </p>
        </div>

        {/* 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: Venue Card */}
          <div className="p-8 rounded-3xl bg-[#0e1020] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                <Navigation className="w-4 h-4" />
                <span>In-Person Campus</span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
                {EVENT_DETAILS.venue.name}
              </h3>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 mb-6 font-mono text-xs sm:text-sm text-slate-300">
                <p className="text-white font-semibold">{EVENT_DETAILS.venue.address}</p>
                <p>{EVENT_DETAILS.venue.city}</p>
                <p>{EVENT_DETAILS.venue.country}</p>
              </div>

              <div className="space-y-3 mb-6 text-sm text-slate-300 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00f0ff]">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <span>High-speed campus Wi-Fi provided for all participants</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#ff007a]">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span>Easily accessible from Hebbal, RT Nagar & Outer Ring Road</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
              <a
                href={EVENT_DETAILS.venue.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Open in Google Maps
              </a>

              <a
                href="https://www.google.com/calendar/render?action=TEMPLATE&text=Hacktoberfest+Hack+Day+Bengaluru+x+AWS+Student+Builder+Group+at+Atria+Institute+of+Technology&dates=20261030T030000Z/20261030T143000Z&details=Hacktoberfest+Hack+Day+at+Atria+IT+Bengaluru.+Register:+https://events.mlh.com/events/15272-hacktoberfest-hack-day-bengaluru-x-aws-student-builder-group-at-atria-institute-of-technology&location=Atria+Institute+of+Technology,+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold border border-white/20 hover:bg-white/5 text-white transition-colors flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4 text-[#ffe600]" />
                Add to Google Calendar
              </a>
            </div>
          </div>

          {/* Column 2: Attendee Checklist & Requirements */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#111326] to-[#0c0e1a] border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Prepare For Hack Day</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-4">
                What to Bring & Checklist
              </h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Make sure you come prepared so you can maximize your time hacking, networking, and earning rewards:
              </p>

              <div className="space-y-4 mb-6">
                {checklist.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs sm:text-sm font-mono text-slate-200"
                    >
                      <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono">
              💡 <span className="font-bold">Tip:</span> Pre-configure Git on your laptop with your name and GitHub email before arriving!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
