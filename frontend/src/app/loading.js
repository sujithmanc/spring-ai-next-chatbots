import React from 'react'

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* A thin, primary-colored loading bar at the top */}
      <progress className="progress progress-primary w-full h-1 rounded-none"></progress>
    </div>
  );
}
