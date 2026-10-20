import React, { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Info, Users } from 'lucide-react';
import { SHORTLISTED_TEAMS, SHORTLISTED_STATS } from '../data/shortlisted';
import SectionHead from './SectionHead';

/* Groups per page (a team never splits across a page), so rows per page
   vary with team sizes - 15 groups keeps a page readable on one screen. */
const PAGE_SIZE = 15;

export default function Shortlisted() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SHORTLISTED_TEAMS;
    return SHORTLISTED_TEAMS.filter(
      (g) =>
        g.team.toLowerCase().includes(q) ||
        g.members.some(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.college.toLowerCase().includes(q)
        )
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(groups.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const slice = groups.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const from = groups.length ? current * PAGE_SIZE + 1 : 0;
  const to = Math.min(groups.length, (current + 1) * PAGE_SIZE);

  const onSearch = (event) => {
    setQuery(event.target.value);
    setPage(0);
  };

  const goto = (next) => {
    setPage(Math.max(0, Math.min(pageCount - 1, next)));
    document.getElementById('roster')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="shortlisted"
      className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]"
    >
      <div className="shell">
        <SectionHead
          eyebrow="Registered roster"
          title={<>The shortlisted teams</>}
          accent="every member, every college."
          pacColor="#e53927"
        />

        {/* Stat strip */}
        <div className="flex flex-wrap gap-3 mb-8 font-mono text-xs">
          {[
            ['Teams', SHORTLISTED_STATS.teams],
            ['Members', SHORTLISTED_STATS.members],
            ['Solo entries', SHORTLISTED_STATS.solo],
          ].map(([label, value]) => (
            <span
              key={label}
              className="border-2 border-[#10201d] bg-white px-3 py-1.5 uppercase tracking-wider"
            >
              <strong className="font-display font-black text-sm mr-2">{value}</strong>
              {label}
            </span>
          ))}
        </div>

        {/* Attendance notices — for people scanning the list and not finding
            their own (or a teammate's) name. */}
        <div className="border-2 border-[#10201d] bg-white mb-8">
          <p className="flex items-center gap-2 bg-[#f5b726] border-b-2 border-[#10201d] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
            <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
            Name missing from the list?
          </p>
          <ol className="divide-y-2 divide-[#10201d]/15">
            <li className="flex items-start gap-3 px-4 py-3 font-mono text-xs leading-relaxed">
              <span className="font-display font-black text-sm shrink-0">01</span>
              <span>
                Registered on or after 18 October with a valid MLH registration?
                You are allowed to attend the event even if your name is not
                shown below.
              </span>
            </li>
            <li className="flex items-start gap-3 px-4 py-3 font-mono text-xs leading-relaxed">
              <span className="font-display font-black text-sm shrink-0">02</span>
              <span>
                If your team member’s name is not mentioned despite having a
                valid MLH registration, they can still show up on event day
                along with the rest of the team.
              </span>
            </li>
          </ol>
        </div>

        {/* Search + roster */}
        <div id="roster" className="border-2 border-[#10201d] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b-2 border-[#10201d] p-4">
            <label className="relative flex-grow sm:max-w-sm">
              <span className="sr-only">Search teams, members or colleges</span>
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#10201d]/60"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={onSearch}
                placeholder="Search team, member or college…"
                aria-label="Search teams, members or colleges"
                className="w-full border-2 border-[#10201d] bg-[#f2f2eb] pl-9 pr-3 py-2 font-mono text-sm placeholder:text-[#10201d]/50 focus:outline-none focus:bg-white"
              />
            </label>
            <p className="font-mono text-xs text-[#10201d]/70 sm:ml-auto">
              {groups.length} of {SHORTLISTED_TEAMS.length} entries
              {query ? ' match your search' : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="bg-[#10201d] text-[#f7f7f2] font-mono text-[11px] uppercase tracking-widest">
                  <th scope="col" className="px-3 sm:px-4 py-3 w-[30%] sm:w-44">Team</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 w-[30%] sm:w-56">Member</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 w-[40%]">College / Organization</th>
                </tr>
              </thead>
              <tbody>
                {slice.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center font-mono text-sm text-[#10201d]/70">
                      Nothing matches “{query}”. Try a shorter word - a college
                      name or a first name works well.
                    </td>
                  </tr>
                ) : (
                  slice.map((group, groupIndex) =>
                    group.members.map((member, memberIndex) => (
                      <tr
                        key={`${group.team}-${member.name}-${memberIndex}`}
                        className={groupIndex % 2 ? 'bg-[#f7f7f2]' : 'bg-white'}
                      >
                        {memberIndex === 0 ? (
                          <td
                            rowSpan={group.members.length}
                            className="px-3 sm:px-4 py-3 border-r-2 border-b border-[#10201d]/15 align-top font-display font-black text-sm sm:text-base leading-tight break-words"
                          >
                            {group.solo ? (
                              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#10201d]/55">
                                Solo
                              </span>
                            ) : (
                              group.team
                            )}
                          </td>
                        ) : null}
                        <td className="px-3 sm:px-4 py-3 border-b border-[#10201d]/15 font-sans text-sm break-words">
                          {member.name}
                        </td>
                        <td className="px-3 sm:px-4 py-3 border-b border-[#10201d]/15 font-sans text-sm text-[#10201d]/80 break-words">
                          {member.college}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#10201d] p-4">
            <p className="font-mono text-xs text-[#10201d]/70">
              Showing {from}–{to} of {groups.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goto(current - 1)}
                disabled={current === 0}
                aria-label="Previous page"
                className="border-2 border-[#10201d] bg-white px-2.5 py-2 font-mono text-xs disabled:opacity-30 enabled:hover:bg-[#10201d] enabled:hover:text-[#f7f7f2]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i)
                .filter((i) =>
                  pageCount <= 9 ||
                  Math.abs(i - current) <= 1 ||
                  i === 0 ||
                  i === pageCount - 1
                )
                .reduce((acc, i) => {
                  const prev = acc[acc.length - 1];
                  if (prev !== undefined && i - prev > 1) acc.push(-1);
                  acc.push(i);
                  return acc;
                }, [])
                .map((i, idx) =>
                  i === -1 ? (
                    <span key={`gap-${idx}`} className="font-mono text-xs text-[#10201d]/50">
                      …
                    </span>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goto(i)}
                      aria-label={`Page ${i + 1}`}
                      aria-current={i === current ? 'page' : undefined}
                      className={`border-2 border-[#10201d] w-9 h-9 font-mono text-xs ${
                        i === current
                          ? 'bg-[#10201d] text-[#f7f7f2]'
                          : 'bg-white hover:bg-[#f5b726]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              <button
                type="button"
                onClick={() => goto(current + 1)}
                disabled={current >= pageCount - 1}
                aria-label="Next page"
                className="border-2 border-[#10201d] bg-white px-2.5 py-2 font-mono text-xs disabled:opacity-30 enabled:hover:bg-[#10201d] enabled:hover:text-[#f7f7f2]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="flex items-start gap-2 mt-6 font-mono text-xs text-[#10201d]/70">
          <Users className="w-4 h-4 mt-px shrink-0" aria-hidden="true" />
          <span>
            The roster follows the final shortlist sheet, one row per sign-up.
            Spot something wrong? Write to{' '}
            <a href="mailto:hacktoberfest@awsatria.tech" className="underline hover:text-[#10201d]">
              hacktoberfest@awsatria.tech
            </a>
            .
          </span>
        </p>
      </div>
    </section>
  );
}
