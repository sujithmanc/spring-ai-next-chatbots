import { ROUTES } from '@/features/dashboard/lib/routes';
import Link from 'next/link';


export default function ProjectDashboard() {
  return (
    <div className="container mx-auto p-8 m-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ROUTES.map((route) => (
          <Link 
            key={route.path} 
            href={route.path} 
            className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="card-body items-center text-center p-8">
              {/* Perfectly Centered Circular Icon */}
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
                <route.Icon size={32} strokeWidth={1.5} />
              </div>

              {/* Text Content */}
              <h2 className="card-title text-xl mb-1">{route.label}</h2>
              <p className="text-sm text-base-content/70">
                {route.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}