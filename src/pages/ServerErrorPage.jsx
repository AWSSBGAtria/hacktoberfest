import React from 'react';
import ErrorPage, { ServerErrorAction, ServerFaultNote } from '../components/ErrorPage';

export default function ServerErrorPage() {
  return (
    <>
      <ErrorPage
        code="500"
        eyebrow="Error 500 · Server fault"
        title="Something broke on our end."
        body="The site hit an unexpected error while loading this page. This is usually temporary - reloading fixes it most of the time."
        accent="#f6c4c1"
        action={<ServerErrorAction />}
      />
      <div className="shell pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <ServerFaultNote />
        </div>
      </div>
    </>
  );
}
