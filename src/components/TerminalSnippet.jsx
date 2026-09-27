import React, { useState } from 'react';
import { Copy, Check, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

export default function TerminalSnippet() {
  const [activeTab, setActiveTab] = useState('status');
  const [copied, setCopied] = useState(false);

  const snippets = {
    status: {
      title: 'event-status.sh',
      cmd: './check-hackday-status.sh',
      output: `[INIT] Connecting to AWS Student Builder Group Atria...
[OK] Event: Hacktoberfest Hack Day Bengaluru 2026
[DATE] Friday, October 30, 2026 | 08:30 AM - 08:00 PM IST
[VENUE] Atria Institute of Technology, Hebbal, Bengaluru
[SLOTS] Open for University Students (Free Entry)
[REWARDS] Holopin Badges + MLH Swag + AWS Credits + Trees Planted
[STATUS] Registration OPEN on MLH ➔ Ready for builders!`,
    },
    git: {
      title: 'git-contribute.sh',
      cmd: 'git checkout -b hacktoberfest-2026',
      output: `Switched to a new branch 'hacktoberfest-2026'
$ git commit -m "feat: first contribution to open source @ Atria"
$ git push origin hacktoberfest-2026
[SUCCESS] Pull Request opened: https://github.com/AWSCloudClubAtria/...
[BOT] 🎉 Valid PR detected! Counted toward your Hacktoberfest badge!`,
    },
    agent: {
      title: 'agent-skills.py',
      cmd: 'ollama run gemma4:latest --agent',
      output: `Loading open-weight Google Gemma 4 on local accelerator...
Ready for Agentic Workflows with SKILL.md specs!
Building collaborative cloud tool for AWS Cloud Club Hack Day...
[INFO] Mentors ready on-site at Atria IT to guide your hack!`,
    },
  };

  const current = snippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(`${current.cmd}\n\n${current.output}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0d0e19]/95 shadow-2xl backdrop-blur-xl font-mono text-xs sm:text-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#131525] border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-slate-400 text-xs hidden sm:inline-block">
            bash ~ hacktoberfest-atria
          </span>
        </div>

        {/* Tab pills */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              activeTab === 'status'
                ? 'bg-[#ff007a]/20 text-[#ff007a] border border-[#ff007a]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            status.sh
          </button>
          <button
            onClick={() => setActiveTab('git')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              activeTab === 'git'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            git-pr.sh
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              activeTab === 'agent'
                ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            agent.py
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
          title="Copy command"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-5 text-slate-300 leading-relaxed overflow-x-auto">
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <span className="text-[#ff007a]">student@atria-hackday</span>
          <span className="text-slate-500">:</span>
          <span className="text-[#00f0ff]">~/hacktoberfest</span>
          <span className="text-slate-300">$</span>
          <span className="text-slate-100 font-semibold">{current.cmd}</span>
        </div>
        <pre className="text-slate-300 text-[11px] sm:text-xs font-mono whitespace-pre-wrap">
          {current.output}
        </pre>
      </div>
    </div>
  );
}
