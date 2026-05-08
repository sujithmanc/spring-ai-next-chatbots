import DummyContent from '@/features/dashboard/ui/DummyContent';
import { Suspense } from 'react';

export default function DemoPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-base-content">
        Sub-Project: Demo
      </h1>

      {/* This fallback shows up INSTANTLY for 10 seconds */}
      <Suspense fallback={<DemoSkeleton />}>
        <DummyContent />
      </Suspense>
    </main>
  );
}

// Simple daisyUI Skeleton Loader
function DemoSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
        <h1>Loading... please wait!!</h1>
    </div>
  );
}