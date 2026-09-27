import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { triggerFestiveConfetti } from '../utils/confetti';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2e4742] text-[#f7f7f2] pt-16 pb-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-3">
            <div className="font-display font-black text-2xl uppercase tracking-tight text-white">
              HACKTOBERFEST
            </div>
            <div className="text-[11px] text-[#8bb2de] uppercase font-bold tracking-wider">
              AWS Student Builder Group · Atria IT
            </div>
            <p className="font-sans text-xs text-slate-300 leading-relaxed pt-2">
              An in-person Hack Day celebrating open-source, cloud infrastructure, and community builder culture in Bengaluru.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-white font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              Navigation
            </div>
            <ul className="space-y-2.5 text-slate-300">
              <li><a href="#about" className="hover:text-white hover:underline">About Hack Day</a></li>
              <li><a href="#tracks" className="hover:text-white hover:underline">Tracks & Themes</a></li>
              <li><a href="#rewards" className="hover:text-white hover:underline">Swag & Badges</a></li>
              <li><a href="#schedule" className="hover:text-white hover:underline">Schedule</a></li>
              <li><a href="#venue" className="hover:text-white hover:underline">Venue & Checklist</a></li>
              <li><a href="#faq" className="hover:text-white hover:underline">FAQs</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-white font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
              Resources
            </div>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <a
                  href={EVENT_DETAILS.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8bb2de] hover:underline flex items-center gap-1 font-bold"
                >
                  MLH Event Page <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={EVENT_DETAILS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline flex items-center gap-1"
                >
                  WhatsApp Group <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={EVENT_DETAILS.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline flex items-center gap-1"
                >
                  AWS Atria Club <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline flex items-center gap-1"
                >
                  MLH Code of Conduct <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* CTA Box */}
          <div className="p-6 bg-[#3d5f58] border-2 border-[#10201d] shadow-[4px_4px_0_#10201d]">
            <div className="font-display font-bold text-lg text-white uppercase mb-2">
              Ready to Hack?
            </div>
            <p className="font-sans text-xs text-[#f6c4c1] mb-4">
              Join us on October 30 at Atria Institute of Technology campus.
            </p>
            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerFestiveConfetti}
              className="ht-btn-primary w-full text-xs py-2.5"
            >
              <span>Register on MLH</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300 text-[11px]">
          <div>
            © 2026 AWS Student Builder Group at Atria Institute of Technology.
          </div>
          <div className="text-slate-400">
            Official Hacktoberfest 2026 Community Event · Powered by MLH
          </div>
        </div>
      </div>
    </footer>
  );
}
