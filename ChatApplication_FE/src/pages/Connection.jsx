import React from 'react';
import Loader from '../components/Loader';

function Connection() {
  return (
    <div
      className="min-h-screen bg-slate-100 flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm flex flex-col items-center rounded-2xl bg-white shadow-lg p-10">
        <Loader size="h-12 w-12" color="border-blue-600" />
        <h1 className="mt-6 text-lg font-semibold text-slate-800 text-center">
          Connecting to the server
        </h1>
        <p className="mt-3 text-center text-sm text-slate-600">
          Please wait for connection establishment.
        </p>
        <span className="sr-only">Loading, please wait.</span>
      </div>
    </div>
  );
}

export default Connection;
