import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Download, ArrowUpRight, Link2, ImagePlus, Share2, ShieldCheck, Dices } from 'lucide-react';
import SectionHead from './SectionHead';

const W = 1600;
const H = 800;
const TAU = Math.PI * 2;
const CREAM = '#f7f7f2';
const INK = '#10201d';
const NAVY = '#211f47';
const YELLOW = '#f5b726';
const CORAL = '#e97b77';
const MUTED = '#aebcff';

// Backgrounds the generated avatar can land on, drawn from the event palette.
const AVATAR_BGS = ['f5b726', 'aebcff', '8bb2de', 'ee8b83', 'd1d4f9', 'ffd5dc'];

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
  while (size > 30 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

// Long names wrap to two balanced lines instead of shrinking to a speck.
// Returns { lines, size }; single short names stay on one line.
function wrapName(ctx, upper, maxWidth, base, family) {
  ctx.font = `800 ${base}px ${family}`;
  const words = upper.split(/\s+/).filter(Boolean);
  if (words.length < 2 || ctx.measureText(upper).width <= maxWidth) {
    return { lines: [upper], size: fitFont(ctx, upper, maxWidth, base, family, 800) };
  }
  for (let size = 52; size >= 30; size -= 2) {
    ctx.font = `800 ${size}px ${family}`;
    let best = null;
    for (let i = 1; i < words.length; i += 1) {
      const a = words.slice(0, i).join(' ');
      const b = words.slice(i).join(' ');
      const w = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
      if (w <= maxWidth && (!best || w < best.w)) best = { lines: [a, b], w };
    }
    if (best) return { lines: best.lines, size };
  }
  return { lines: [upper], size: fitFont(ctx, upper, maxWidth, base, family, 800) };
}

function drawContain(ctx, img, x, y, w, h) {
  const s = Math.min(w / img.width, h / img.height);
  const dw = img.width * s;
  const dh = img.height * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

// `crossOrigin` matters for the avatar: without it the browser taints the
// canvas and canvas.toBlob() throws on download. DiceBear sends
// access-control-allow-origin: *, so an anonymous CORS read succeeds.
function loadImage(src, crossOrigin = false) {
  return new Promise((resolve) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// DiceBear builds an avatar URL from a seed, so the same seed always yields the
// same face and a re-render can't change it under the user. Voxel Bot on v10.x.
// Two parameter details, both found by checking responses rather than assuming:
//   - `size`, not `width`/`height` (those are silently ignored on this route)
//   - SVG, not PNG: the PNG route caps at 256px, too soft for the 376px plate,
//     and an SVG taints the canvas on export unless loaded via CORS.
// The background is picked per-avatar from the event palette so a regenerated
// face does not also change the plate colour out from under the user.
function avatarUrl(seed) {
  return `https://api.dicebear.com/10.x/voxel-bot/svg?seed=${encodeURIComponent(seed)}&size=376&backgroundColor=${avatarBackground(seed)}`;
}

// Deterministic: the colour is derived from the same seed as the face, so the
// avatar is stable across reloads instead of flickering on every re-render.
function avatarBackground(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  return AVATAR_BGS[h % AVATAR_BGS.length];
}

function randomSeed() {
  return Math.random().toString(36).slice(2, 10);
}

// Landscape ticket, 2:1. Left: photo plate, name, attending chip. Right:
// title block, sponsor lockup (same partners as the hero), club mark.
function drawBadge(canvas, assets, photo, name) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const mark = assets ? assets.mark : null;
  const mlh = assets ? assets.mlh : null;
  const dev = assets ? assets.dev : null;
  const digio = assets ? assets.dig : null;

  // Chrome backdrop with a soft glow, like the hero.
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(1150, 260, 60, 1150, 260, 700);
  glow.addColorStop(0, 'rgba(81, 70, 217, .55)');
  glow.addColorStop(1, 'rgba(81, 70, 217, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Double frame.
  ctx.strokeStyle = CREAM;
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 10;
  ctx.strokeRect(52, 52, W - 104, H - 104);

  // Ticket perforation between photo and content.
  ctx.save();
  ctx.strokeStyle = CREAM;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 12]);
  ctx.beginPath();
  ctx.moveTo(660, 100);
  ctx.lineTo(660, 700);
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // ---- Left: photo, wrapped name, chip.
  const ps = 400;
  const px = 130;
  const py = 100;
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
    ctx.font = '800 170px "Bricolage Grotesque", Manrope, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(initialsOf(name), px + ps / 2, py + ps / 2 + 8);
    ctx.textBaseline = 'alphabetic';
  }

  // Names wrap to two balanced lines (input caps at 30 chars); short names
  // stay on one line. Block sits centred in the space below the plate.
  const label = (name.trim() || 'YOUR NAME').toUpperCase();
  const wrapped = wrapName(ctx, label, 500, 60, '"Bricolage Grotesque", Manrope, sans-serif');
  ctx.fillStyle = CREAM;
  ctx.font = `800 ${wrapped.size}px "Bricolage Grotesque", Manrope, sans-serif`;
  if (wrapped.lines.length === 1) {
    ctx.fillText(wrapped.lines[0], px + ps / 2, 608);
  } else {
    ctx.fillText(wrapped.lines[0], px + ps / 2, 576);
    ctx.fillText(wrapped.lines[1], px + ps / 2, 632);
  }

  ctx.fillStyle = CORAL;
  ctx.font = '700 27px "IBM Plex Mono", monospace';
  ctx.fillText('★ ATTENDING · OCT 23 ★', px + ps / 2, 680);

  // ---- Right: brandmark, venue, title, sponsors, club mark.
  const rcx = 1105;
  ctx.textAlign = 'center';
  try {
    ctx.letterSpacing = '0px';
  } catch {
    /* noop */
  }

  // Brandmark: program icon left, two-line wordmark right, centred as one.
  ctx.fillStyle = CREAM;
  ctx.font = '700 32px "IBM Plex Mono", monospace';
  ctx.textAlign = 'left';
  const line1 = 'AWS STUDENT';
  const line2 = 'BUILDER GROUP';
  const wordW = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width);
  const markS = 92;
  const markGap = 22;
  const lockX = rcx - (markS + markGap + wordW) / 2;
  if (mark) {
    drawContain(ctx, mark, lockX, 96, markS, markS);
  }
  ctx.fillText(line1, lockX + markS + markGap, 138);
  ctx.fillText(line2, lockX + markS + markGap, 176);
  ctx.textAlign = 'center';

  ctx.fillStyle = CREAM;
  const titleSize = fitFont(ctx, 'HACKTOBERFEST', 780, 96, '"Bricolage Grotesque", Manrope, sans-serif', 800);
  ctx.font = `800 ${titleSize}px "Bricolage Grotesque", Manrope, sans-serif`;
  ctx.fillText('HACKTOBERFEST', rcx, 330);
  ctx.fillStyle = YELLOW;
  ctx.font = '800 44px "Bricolage Grotesque", Manrope, sans-serif';
  ctx.fillText('HACK DAY · BENGALURU 2026', rcx, 390);

  // Sponsor lockup, same partners as the hero.
  ctx.textAlign = 'left';
  ctx.fillStyle = MUTED;
  ctx.font = '700 20px "IBM Plex Mono", monospace';
  ctx.fillText('POWERED BY', 730, 478);
  ctx.fillText('PRESENTING PARTNER', 1120, 478);
  const plate = (x, draw) => {
    ctx.fillStyle = CREAM;
    ctx.fillRect(x, 496, 300, 84);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(x, 496, 300, 84);
    draw(x + 14, 510, 272, 56);
  };
  ctx.fillStyle = INK;
  ctx.font = '700 30px "IBM Plex Mono", monospace';
  plate(730, (x, y, w, h) => {
    // MLH mark, divider cross, DEV mark: measured as one centred lockup so
    // no trailing space sits inside the plate.
    const gap = 6;
    const xw = ctx.measureText('×').width;
    const share = (w - gap * 2 - xw) / 2;
    let mw = 0;
    let mh = 0;
    if (mlh) {
      const s = Math.min(share / mlh.width, h / mlh.height);
      mw = mlh.width * s;
      mh = mlh.height * s;
    }
    let dw = 0;
    let dh = 0;
    if (dev) {
      const s = Math.min(share / dev.width, h / dev.height);
      dw = dev.width * s;
      dh = dev.height * s;
    }
    let cx = x + (w - (mw + gap + xw + gap + dw)) / 2;
    ctx.textAlign = 'left';
    if (mlh) {
      ctx.drawImage(mlh, cx, y + (h - mh) / 2, mw, mh);
      cx += mw + gap;
    }
    ctx.fillText('×', cx, y + h / 2 + 11);
    cx += xw + gap;
    if (dev) {
      ctx.drawImage(dev, cx, y + (h - dh) / 2, dw, dh);
    }
  });
  plate(1120, (x, y, w, h) => {
    if (digio) drawContain(ctx, digio, x, y, w, h);
  });
  ctx.textAlign = 'center';

  // Venue row: bottom strip below the sponsors, centred on the right panel
  // exactly like the title, subtitle and lockup above it.
  const venue = 'Atria Institute of Technology, Bengaluru';
  ctx.textAlign = 'left';
  ctx.font = '700 26px "IBM Plex Mono", monospace';
  const venueW = ctx.measureText(venue).width;
  const pinS = 34;
  const pinGap = 14;
  const rowX = rcx - (pinS + pinGap + venueW) / 2;
  const pinCx = rowX + pinS / 2;
  const pinTip = 720;
  ctx.fillStyle = '#e53927';
  ctx.beginPath();
  ctx.moveTo(pinCx, pinTip);
  ctx.bezierCurveTo(
    pinCx - pinS * 0.5, pinTip - pinS * 0.45,
    pinCx - pinS * 0.42, pinTip - pinS,
    pinCx, pinTip - pinS,
  );
  ctx.bezierCurveTo(
    pinCx + pinS * 0.42, pinTip - pinS,
    pinCx + pinS * 0.5, pinTip - pinS * 0.45,
    pinCx, pinTip,
  );
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.arc(pinCx, pinTip - pinS * 0.62, pinS * 0.14, 0, TAU);
  ctx.fill();
  ctx.fillStyle = MUTED;
  ctx.fillText(venue, rowX + pinS + pinGap, 716);
  ctx.textAlign = 'center';
}

export default function BadgeMaker() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [assets, setAssets] = useState(null);
  const [name, setName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  // Photo upload is the default and the preferred path. With no photo chosen, the
  // ticket shows a generated avatar instead; the "Generate random avatar" button
  // rerolls that avatar without changing the form around it. `avatarSeed` keeps
  // the face stable across re-renders, and the background colour is derived from
  // the same seed, so face and plate colour always reroll together.
  const [avatarSeed, setAvatarSeed] = useState(() => randomSeed());
  const [avatarImg, setAvatarImg] = useState(null);
  const [avatarError, setAvatarError] = useState('');

  const useAvatar = photo === null;

  useEffect(() => {
    if (!useAvatar) {
      setAvatarImg(null);
      return undefined;
    }
    let live = true;
    loadImage(avatarUrl(avatarSeed), true).then((img) => {
      if (!live) return;
      if (img) {
        setAvatarImg(img);
        setAvatarError('');
      } else {
        setAvatarImg(null);
        setAvatarError('Could not load an avatar. Try again, or upload a photo.');
      }
    });
    return () => {
      live = false;
    };
  }, [useAvatar, avatarSeed]);

  useEffect(() => {
    let live = true;
    Promise.all([
      document.fonts.load('800 100px "Bricolage Grotesque"'),
      document.fonts.load('700 30px "IBM Plex Mono"'),
      loadImage('/aws-sbg-mark.png').then((mark) => ({ mark })),
      loadImage('/MLH.png').then((mlh) => ({ mlh })),
      loadImage('/Dev.png').then((dev) => ({ dev })),
      loadImage('/DigitalOcean.png').then((dig) => ({ dig })),
    ])
      .then(([, , ...logos]) => {
        if (live) {
          setAssets(Object.assign({}, ...logos));
          setFontsReady(true);
        }
      })
      .catch(() => {
        if (live) setFontsReady(true);
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (fontsReady && canvasRef.current) {
      drawBadge(canvasRef.current, assets, photo || avatarImg, name);
    }
  }, [fontsReady, assets, photo, avatarImg, name]);

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
    drawBadge(canvas, assets, photo || avatarImg, name);
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
  }, [assets, photo, avatarImg, name]);

  const copyCaption = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text || `${EVENT_DETAILS.promoText}\n${window.location.origin}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, []);

  // LinkedIn only creates a company mention when the page URL is attached to
  // the post, so the share window carries it and the caption names the page for
  // people who paste manually.
  const shareLinkedIn = useCallback(async () => {
    await copyCaption(
      `${EVENT_DETAILS.promoText}\n${EVENT_DETAILS.linkedinUrl}\n${window.location.origin}`,
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(EVENT_DETAILS.linkedinUrl)}`,
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
    drawBadge(canvas, assets, photo || avatarImg, name);
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
  }, [assets, photo, avatarImg, name]);

  return (
    <section id="badge" className="theme-section py-20 sm:py-28 bg-[#f2f2eb] text-[#10201d] border-b-2 border-[#10201d]">
      <div className="shell">
        <SectionHead
          eyebrow="SHARE THE DAY"
          title={<>Get your attendee</>}
          accent="badge."
          pacColor="#f5b726"
          deck="Add your photo, type your name, and take home a wide ticket badge made for LinkedIn and X timelines. Prefer not to use your photo? Generate a Voxel Bot avatar instead. Download the PNG, then post it with the caption below."
        />

        {/* Privacy, stated before the upload field rather than buried below it.
            The badge maker is entirely client-side: no fetch, no upload, no
            analytics, so this is a description of how it actually works. */}
        <div className="flex items-start gap-3 border-2 border-[#10201d] bg-[#e4e5da] px-5 py-4 mb-6">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-mono text-[12px] leading-relaxed text-[#10201d]">
            <strong className="font-bold">Nothing is uploaded, nothing is stored.</strong>{' '}
            Your photo and name are used only in your browser to draw this badge,
            and they never leave your device — not to us, not to a server, not to
            anyone. Close the tab and they are gone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Make it yours */}
          <div className="border-2 border-[#10201d] bg-[#f7f7f2] shadow-[7px_7px_0_#671912] p-6 sm:p-7 grid gap-5 content-start">
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
              <button
                type="button"
                onClick={() => {
                  setAvatarSeed(randomSeed());
                  setPhotoError('');
                }}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] font-bold uppercase border-2 border-[#10201d] bg-[#f7f7f2] text-[#10201d] hover:bg-[#f5b726] shadow-[4px_4px_0_#10201d]"
              >
                <Dices className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Generate random avatar</span>
              </button>
              {useAvatar && avatarError && (
                <p className="font-mono text-[11px] font-bold text-[#a41612] mt-2" role="alert">
                  {avatarError}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <label
                  htmlFor="badge-name"
                  className="font-mono text-xs font-bold uppercase tracking-[0.08em]"
                >
                  2 · Your full name
                </label>
                <span className="font-mono text-[11px] text-[#5c665f]" aria-hidden="true">
                  {name.length} / 30
                </span>
              </div>
              <input
                id="badge-name"
                type="text"
                value={name}
                maxLength={30}
                onChange={(e) => setName(e.target.value.slice(0, 30))}
                placeholder="Aarav Sharma"
                autoComplete="name"
                aria-describedby="badge-name-hint"
                className="w-full border-2 border-[#10201d] bg-white px-3 py-2.5 text-base text-[#10201d] placeholder:text-[#7a847f] focus:outline-2 focus:outline-[#5146d9] focus:outline-offset-1"
              />
              <p id="badge-name-hint" className="font-mono text-[11px] text-[#5c665f] mt-1.5">
                Long names wrap to two lines on the ticket.
              </p>
            </div>
          </div>

          {/* Live preview */}
          <div className="border-2 border-[#10201d] bg-[#211f47] shadow-[7px_7px_0_#671912] p-4 sm:p-6 grid content-center">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="block w-full h-auto"
              aria-label="Preview of your attendee badge"
            />
          </div>

          {/* Take it with you */}
          <div className="border-2 border-[#10201d] bg-[#f7f7f2] shadow-[7px_7px_0_#671912] p-6 sm:p-7 grid gap-3 content-start">
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
              LinkedIn opens ready to post with our company page tagged, and your
              caption is copied — paste it and attach the PNG.
            </p>
          </div>

          {/* Caption */}
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
    </section>
  );
}
