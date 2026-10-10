import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import Overlay from 'ol/Overlay.js';
import { fromLonLat } from 'ol/proj.js';
import { defaults as defaultControls, Attribution } from 'ol/control.js';
import { defaults as defaultInteractions } from 'ol/interaction.js';
import 'ol/ol.css';

const LAT = 13.032716;
const LON = 77.59143;

// Our own red pin (ink-stroked, cream centre), dropped on the venue as an
// OpenLayers overlay so it pans and zooms with the map.
const PIN_SVG = `<svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 43C17 43 32 26.4 32 16.5A15 15 0 1 0 2 16.5C2 26.4 17 43 17 43Z" fill="#e53927" stroke="#10201d" stroke-width="3" stroke-linejoin="round"/><circle cx="17" cy="16.5" r="5.5" fill="#f7f7f2" stroke="#10201d" stroke-width="2.5"/></svg>`;

/**
 * Interactive venue map on OSM raster tiles (no key, no consent walls).
 * OpenLayers ships with the bundle, so there is no CDN dependency.
 * Scroll-wheel zoom stays off so the page keeps scrolling; drag to pan,
 * double-click or the buttons to zoom.
 */
export default function VenueMap() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined') return undefined;

    const pin = document.createElement('span');
    pin.className = 'venue-pin-icon';
    pin.innerHTML = PIN_SVG;
    pin.setAttribute('aria-hidden', 'true');

    const overlay = new Overlay({
      element: pin,
      positioning: 'bottom-center',
      stopEvent: false,
      position: fromLonLat([LON, LAT]),
    });

    const map = new Map({
      target: node,
      layers: [
        new TileLayer({
          source: new OSM({ maxZoom: 19 }),
        }),
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([LON, LAT]),
        zoom: 17,
      }),
      controls: defaultControls({ attribution: false }).extend([
        new Attribution({ collapsible: false }),
      ]),
      interactions: defaultInteractions({ mouseWheelZoom: false }),
    });

    return () => {
      map.setTarget(null);
      map.dispose();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="venue-ol"
      role="application"
      aria-label="Map showing Atria Institute of Technology"
    />
  );
}
