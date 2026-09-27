import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Sparkles, ExternalLink, Heart, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#05060b] border-t border-white/10 pt-16 pb-12 relative overflow-hidden text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff007a] via-[#8b5cf6] to-[#00f0ff] p-[2px]">
                <div className="w-full h-full bg-[#0b0c14] rounded-[10px] flex items-center justify-center text-lg">
                  🎃
                </div>
              </div>
              <span className="font-display font-black text-lg text-white tracking-wide">
                HACKTOBERFEST HACK DAY
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-sm leading-relaxed">
              An in-person celebration of open source, hands-on cloud building with AWS, and open-weight AI exploration hosted by AWS Student Builder Group at Atria Institute of Technology, Bengaluru.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={EVENT_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-400 text-emerald-400 flex items-center justify-center transition-colors"
                title="WhatsApp Group"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={EVENT_DETAILS.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-[#00f0ff] text-[#00f0ff] flex items-center justify-center transition-colors"
                title="Club Website"
              >
                <Globe className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/AWSCloudClubAtria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-white text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="GitHub Organization"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h5 className="font-display font-bold text-sm text-white mb-3 tracking-wider">
              NAVIGATION
            </h5>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-white transition-colors">About Event</a></li>
              <li><a href="#tracks" className="hover:text-white transition-colors">Tracks & Themes</a></li>
              <li><a href="#rewards" className="hover:text-white transition-colors">Swag & Badges</a></li>
              <li><a href="#schedule" className="hover:text-white transition-colors">Day Schedule</a></li>
              <li><a href="#venue" className="hover:text-white transition-colors">Venue & Logistics</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Col 4: Important Links */}
          <div>
            <h5 className="font-display font-bold text-sm text-white mb-3 tracking-wider">
              RESOURCES
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  href={EVENT_DETAILS.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00f0ff] hover:underline flex items-center gap-1"
                >
                  MLH Event Page <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={EVENT_DETAILS.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  AWS Atria Club <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={EVENT_DETAILS.hacktoberfestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  Official Hacktoberfest <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  MLH Code of Conduct <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Registration CTA */}
          <div>
            <h5 className="font-display font-bold text-sm text-white mb-3 tracking-wider">
              REGISTRATION
            </h5>
            <p className="text-slate-400 text-xs mb-3 font-sans">
              Limited spots available for October 30 at Atria IT campus.
            </p>
            <a
              href={EVENT_DETAILS.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerFestiveConfetti}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-display font-bold text-xs text-white bg-[#ff007a] hover:bg-[#ff248a] shadow-md shadow-[#ff007a]/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Register on MLH
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 AWS Student Builder Group at Atria Institute of Technology. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-[#ff007a] fill-[#ff007a] mx-1 inline" /> for the Open Source Community
          </div>
        </div>
      </div>
    </footer>
  );
}
