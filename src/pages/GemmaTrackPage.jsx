import React from 'react';
import TrackDetailPage from '../components/TrackDetailPage';
import { TRACK_PAGES } from '../data/trackDetails';

export default function GemmaTrackPage() {
  return <TrackDetailPage track={TRACK_PAGES['gemma-4']} />;
}
