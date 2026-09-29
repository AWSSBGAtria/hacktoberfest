import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Download, ArrowUpRight, Link2, ImagePlus, Share2 } from 'lucide-react';
import SectionHead from './SectionHead';

const SIZE = 1080;
const CREAM = '#f7f7f2';
const INK = '#10201d';
const NAVY = '#211f47';
const YELLOW = '#f5b726';
const SKY = '#8bb2de';
const CORAL = '#e97b77';
const MUTED = '#aebcff';

function initialsOf(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function drawCover(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const dw = img.width * s;
  const dh = img.height * s;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
}

function fitFont(ctx, text, maxWidth, base, family, weight) {
  let size = base;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > 34 && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function drawBadge(canvas, photo, name) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = SIZE;
  const H = SIZE;
  const cx = W / 2;

  // Chrome backdrop with a soft top glow, like the hero.
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(cx, 300, 60, cx, 300, 620);
  glow.addColorStop(0, 'rgba(81, 70, 217, .55)');
  glow.addColorStop(1, 'rgba(81, 70, 217, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Double frame: cream hairline outside, ink rule inside.
  ctx.strokeStyle = CREAM;
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 10;
  ctx.strokeRect(52, 52, W - 104, H - 104);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Eyebrow.
  ctx.fillStyle = SKY;
  ctx.font = '700 30px "IBM Plex Mono", monospace';
  try {
    ctx.letterSpacing = '8px';
  } catch {
    /* older canvas: tracking unsupported, still fine */
  }
  ctx.fillText('AWS STUDENT BUILDER GROUP · ATRIA IT', cx + 4, 128);
  try {
    ctx.letterSpacing = '0px';
  } catch {
    /* noop */
  }

  // Title block.
  ctx.fillStyle = CREAM;
  ctx.font = '800 118px "Bricolage Grotesque", Manrope, sans-serif';
  ctx.fillText('HACKTOBERFEST', cx, 248);
  ctx.fillStyle = YELLOW;
  ctx.font = '800 54px "Bricolage Grotesque", Manrope, sans-serif';
  ctx.fillText('HACK DAY · BENGALURU 2026', cx, 312);

  // Photo plate with hard offset shadow.
  const ps = 440;
  const px = cx - ps / 2;
  const py = 356;
  ctx.fillStyle = CREAM;
  ctx.fillRect(px + 16, py + 16, ps, ps);
  ctx.fillStyle = INK;
  ctx.fillRect(px, py, ps, ps);
  if (photo && photo.width > 0) {
    drawCover(ctx, photo, px + 12, py + 12, ps - 24, ps - 24);
  } else {
    ctx.fillStyle = YELLOW;
    ctx.fillRect(px + 12, py + 12, ps - 24, ps - 24);
    ctx.fillStyle = INK;
    ctx.font = '800 190px "Bricolage Grotesque", Manrope, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(initialsOf(name), cx, py + ps / 2 + 8);
    ctx.textBaseline = 'alphabetic';
  }

  // Name, shrunk to fit.
  const label = name.trim() || 'YOUR NAME';
  ctx.fillStyle = CREAM;
  const size = fitFont(ctx, label.toUpperCase(), 920, 76, '"Bricolage Grotesque", Manrope, sans-serif', 800);
  ctx.font = `800 ${size}px "Bricolage Grotesque", Manrope, sans-serif`;
  ctx.fillText(label.toUpperCase(), cx, 892);

  // Attending chip.
  ctx.fillStyle = CORAL;
  ctx.font = '700 30px "IBM Plex Mono", monospace';
  ctx.fillText('★ ATTENDING · OCT 23 ★', cx, 952);

  // Footer.
  ctx.fillStyle = MUTED;
  ctx.font = '700 24px "IBM Plex Mono", monospace';
  ctx.fillText('HACKTOBERFEST HACK DAY · BENGALURU', cx, 1006);
}

export default function BadgeMaker() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [name, setName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([
      document.fonts.load('800 100px "Bricolage Grotesque"'),
      document.fonts.load('700 30px "IBM Plex Mono"'),
    ])
      .catch(() => {})
      .finally(() => {
        if (live) setFontsReady(true);
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (fontsReady && canvasRef.current) {
      drawBadge(canvasRef.current, photo, name);
    }
  }, [fontsReady, photo, name]);

  const takeFile = useCallback((file) => {
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('That file is not an image - try a JPG or PNG.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError('Please keep the photo under 8 MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPhoto(img);
      setPhotoName(file.name);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setPhotoError('Could not read that image - try another file.');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawBadge(canvas, photo, name);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hacktoberfest-hack-day-badge.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  }, [photo, name]);

  const copyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${EVENT_DETAILS.promoText}\n${window.location.origin}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, []);

  const shareLinkedIn = useCallback(async () => {
    await copyCaption();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
      '_blank',
      'noopener,width=640,height=640',
    );
  }, [copyCaption]);

  const canNativeShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function';

  const shareNative = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawBadge(canvas, photo, name);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'hacktoberfest-hack-day-badge.png', { type: 'image/png' });
      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Hacktoberfest Hack Day Bengaluru 2026',
            text: EVENT_DETAILS.promoText,
          });
        }
      } catch {
        /* user cancelled - stay on the page */
      }
    }, 'image/png');
  }, [photo, name]);

  return (
    <section id="badge" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        <SectionHead
          eyebrow="SHARE THE DAY"
          title={<>Get your attendee</>}
          accent="badge."
          pacColor="#f5b726"
          deck="Drop your photo, type your name, and take home a square badge made for LinkedIn and X timelines. Download the PNG, then post it with the caption below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Controls */}
          <div className="border-2 border-[#10201d] bg-[#f7f7f2] shadow-[7px_7px_0_#671912] p-6 sm:p-7 grid gap-5">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] mb-2">
                1 · Your photo
              </p>
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload a photo for your badge"
                onClick={() => fileRef.current && fileRef.current.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileRef.current && fileRef.current.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  takeFile(e.dataTransfer.files && e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed border-[#10201d] p-6 text-center cursor-pointer transition-colors ${
                  dragging ? 'bg-[#f5b726]' : 'bg-[#e4e5da] hover:bg-[#f5b726]/40'
                }`}
              >
                <ImagePlus className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                <p className="font-mono text-xs font-bold">
                  {photoName || 'Drop a photo here, or click to browse'}
                </p>
                <p className="font-mono text-[11px] text-[#34433f] mt-1">JPG or PNG, under 8 MB</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => takeFile(e.target.files && e.target.files[0])}
              />
              {photoError && (
                <p className="font-mono text-xs font-bold text-[#a41612] mt-2" role="alert">
                  {photoError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="badge-name"
                className="block font-mono text-xs font-bold uppercase tracking-[0.08em] mb-2"
              >
                2 · Your full name
              </label>
              <input
                id="badge-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 40))}
                placeholder="Aarav Sharma"
                autoComplete="name"
                className="w-full border-2 border-[#10201d] bg-white px-3 py-2.5 text-base text-[#10201d] placeholder:text-[#7a847f] focus:outline-2 focus:outline-[#5146d9] focus:outline-offset-1"
              />
            </div>

            <div className="grid gap-3">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.08em]">
                3 · Take it with you
              </p>
              <button type="button" onClick={download} className="ht-btn-primary w-full text-sm">
                <Download className="w-4 h-4 mr-2" />
                <span>Download badge PNG</span>
              </button>
              <button
                type="button"
                onClick={shareLinkedIn}
                className="px-6 py-3.5 font-mono text-xs font-bold border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] hover:bg-[#e4e5da] shadow-[4px_4px_0_#10201d] flex items-center justify-center gap-2 w-full"
              >
                <ArrowUpRight className="w-4 h-4 text-[#e53927]" />
                <span>Share on LinkedIn</span>
              </button>
              {canNativeShare && (
                <button
                  type="button"
                  onClick={shareNative}
                  className="px-6 py-3.5 font-mono text-xs font-bold border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] hover:bg-[#e4e5da] shadow-[4px_4px_0_#10201d] flex items-center justify-center gap-2 w-full"
                >
                  <Share2 className="w-4 h-4 text-[#e53927]" />
                  <span>Share image to apps</span>
                </button>
              )}
              <p className="font-mono text-[11px] text-[#5c665f] leading-relaxed">
                LinkedIn opens its share dialog and copies your caption — attach
                the downloaded PNG there.
              </p>
            </div>
          </div>

          {/* Preview + caption */}
          <div className="grid gap-6">
            <div className="border-2 border-[#10201d] bg-[#211f47] shadow-[7px_7px_0_#671912] p-4 sm:p-6">
              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                className="block w-full h-auto"
                aria-label="Preview of your attendee badge"
              />
            </div>
            <div className="border-2 border-[#10201d] bg-[#f7f7f2] shadow-[7px_7px_0_#671912] p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.08em]">
                  Post caption
                </p>
                <button
                  type="button"
                  onClick={copyCaption}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase border-2 border-[#10201d] bg-[#e4e5da] hover:bg-[#f5b726]"
                >
                  <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-sans text-sm text-[#34433f] leading-relaxed whitespace-pre-line">
                {EVENT_DETAILS.promoText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
