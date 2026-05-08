"use client"

import { ROUTES } from '@/features/dashboard/lib/routes';
import NavCard from '@/features/dashboard/ui/NavCard';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-base-200 py-16 px-8">
      {/* Title and Header */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-black text-base-content mb-4 tracking-tight">
          Project Dashboard
        </h1>
        <p className="text-lg text-base-content/70">
          Select a sub-project to continue. The system will prepare your workspace upon selection.
        </p>
        <div className="divider divider-primary w-24 mx-auto mt-8"></div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {ROUTES.map((route) => (
          <NavCard key={route.path} route={route} />
        ))}
      </div>

      {/* Margin for footer spacing */}
      <footer className="mt-20 text-center text-base-content/40 text-sm">
        © 2026 Your Development Hub
      </footer>
    </main>
  );
}