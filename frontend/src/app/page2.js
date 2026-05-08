import { ROUTES } from '@/features/dashboard/lib/routes';
import Link from 'next/link';


export default function ProjectDashboard() {
    return (
        <main className="min-h-screen bg-base-200 p-8 m-30">
            {/* Title Section */}
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight">
                    Project Hub
                </h1>
                <p className="mt-4 text-lg text-primary text-base-content/70">
                    Manage and access your sub-projects from a single dashboard.
                </p>
                <div className="divider divider-primary w-24 mx-auto mt-6"></div>
            </header>

            {/* Grid Layout with daisyUI utility spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {ROUTES.map((route) => (
                    <Link
                        key={route.path}
                        href={route.path}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 border border-base-300"
                    >
                        <div className="card-body items-center text-center p-10">
                            {/* Exactly centered Icon in a Circle */}
                            <div className="mask mask-circle bg-primary/10 text-primary w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                                <route.Icon size={40} strokeWidth={1.5} />
                            </div>

                            {/* Title and Description */}
                            <h2 className="card-title text-2xl font-bold">{route.label}</h2>
                            <p className="text-sm text-base-content/60 leading-relaxed mt-2">
                                {route.description}
                            </p>

                            {/* Action Button Indicator */}
                            <div className="card-actions mt-6">
                                <button className="btn btn-primary btn-outline btn-sm group-hover:btn-active">
                                    Launch
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}