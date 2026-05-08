"use client"; // Must be a client component to use hooks

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function NavCard({ route }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (e) => {
    e.preventDefault();
    // startTransition stays "true" until the new page is ready
    startTransition(() => {
      router.push(route.path);
    });
  };

  return (
    <div 
      onClick={handleNavigation}
      className={`card bg-base-100 shadow-xl cursor-pointer border border-base-300 transition-all 
        ${isPending ? 'opacity-70 pointer-events-none' : 'hover:-translate-y-2'}`}
    >
      <div className="card-body items-center text-center p-10">
        {/* Circle Icon - Switches to Spinner when Loading */}
        <div className="mask mask-circle bg-primary/10 text-primary w-20 h-20 flex items-center justify-center mb-6">
          {isPending ? (
            <span className="loading loading-spinner loading-lg text-primary"></span>
          ) : (
            <route.Icon size={40} strokeWidth={1.5} />
          )}
        </div>

        <h2 className="card-title text-2xl font-bold">{route.label}</h2>
        <p className="text-sm text-base-content/60 mt-2">{route.description}</p>
        
        <div className="card-actions mt-6">
          <button className={`btn btn-primary btn-sm ${isPending ? 'btn-disabled' : ''}`}>
            {isPending ? 'Loading...' : 'Launch'}
          </button>
        </div>
      </div>
    </div>
  );
}