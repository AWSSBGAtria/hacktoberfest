import React, { useEffect, useRef } from 'react';
import { EVENT_DETAILS } from '../data/eventData';

const LAT = 13.032716;
const LON = 77.59143;

// Our own red pin (ink-stroked, cream centre) as a Leaflet divIcon, so it
// pans and zooms with the map instead of floating over its centre.
const PIN_SVG = `<svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 43C17 43 32 26.4 32 16.5A15 15 0 1 0 2 16.5C2 26.4 17 43 17 43Z" fill="#e53927" stroke="#10201d" stroke-width="3" stroke-linejoin="round"/><circle cx="17" cy="16.5" r="5.5" fill="#f7f7f2" stroke="#10201d" stroke-width="2.5"/></svg>`;

/**
 * Interactive venue map on OSM raster tiles (no key, no consent walls, no
 * google domain). Scroll-wheel zoom stays off so the page keeps scrolling;
 * drag to pan, double-click or the buttons to zoom.
 */
export default function VenueMap() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined' || !window.L) return undefined;
    if (node._leaflet_id) return undefined;
    const L = window.L;
    const map = L.map(node, { scrollWheelZoom: false }).setView([LAT, LON], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const icon = L.divIcon({
      html: `<span class="venue-pin-icon">${PIN_SVG}</span>`,
      className: '',
      iconSize: [34, 44],
      iconAnchor: [17, 43],
    });
    L.marker([LAT, LON], { icon, interactive: false, keyboard: false }).addTo(map);
    return () => {
      map.remove();
    };
  }, []);

  if (typeof window !== 'undefined' && !window.L) {
    return (
      <div className="venue-map-fallback">
        <p>Interactive map needs a connection.</p>
        <a
          href={EVENT_DETAILS.venue.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ht-btn-primary text-xs py-2 px-4"
        >
          Open directions instead
        </a>
      </div>
    );
  }

  return <div ref={ref} className="venue-leaflet" role="application" aria-label="Map showing Atria Institute of Technology" />;
}
