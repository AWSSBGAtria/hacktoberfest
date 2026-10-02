import React from 'react';
import ErrorPage from '../components/ErrorPage';

export default function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      eyebrow="Error 404 · Route not found"
      title="This page took a wrong turn."
      body="The link is broken, the page has moved, or the address has a typo in it. Nothing here is broken on your side - the event pages are all still where you left them."
      accent="#aebaff"
    />
  );
}
