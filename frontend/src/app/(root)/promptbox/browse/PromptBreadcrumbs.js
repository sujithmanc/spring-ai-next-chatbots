"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function PromptBreadcrumbs() {

    const [breadcrumbPath, setBreadcrumbPath] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(1); // Default to root

    return (
        < nav className="text-sm breadcrumbs bg-base-200/50 px-4 py-2 rounded-full border border-base-300 inline-block" >
            <ul className="flex items-center">
                <li>
                    <Link href="/promptbox/browse" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Home size={14} />
                        <span className="hidden sm:inline">Root</span>
                    </Link>
                </li>

                {breadcrumbPath.map((crumb, idx) => {
                    if (crumb.id === 1 && idx === 0) return null; // Avoid double Root
                    return (
                        <li key={crumb.id} className="flex items-center gap-2">
                            <ChevronRight size={12} className="opacity-30" />
                            <Link
                                href={`/promptbox/browse?folderId=${crumb.id}`}
                                className={`hover:text-primary transition-colors ${crumb.id === currentFolderId ? "font-bold text-base-content" : ""
                                    }`}
                            >
                                {crumb.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav >
    )
};