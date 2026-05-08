import React from 'react';
import { motion } from 'framer-motion';

// 1. The Classic Blue-Indigo
export const OceanText = ({ children }) => (
    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-400 bg-clip-text text-transparent font-bold">
        {children}
    </span>
);

// 2. High-End Sunset
export const SunsetText = ({ children }) => (
    <span className="bg-gradient-to-tr from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent font-extrabold">
        {children}
    </span>
);

// 3. Cyberpunk Neon
export const NeonText = ({ children }) => (
    <span className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-blue-500 bg-clip-text text-transparent font-black tracking-tighter">
        {children}
    </span>
);

// 4. Emerald Forest (Eco/Fresh)
export const EmeraldText = ({ children }) => (
    <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-bold">
        {children}
    </span>
);

// 5. Golden Hour (Luxury)
export const GoldenText = ({ children }) => (
    <span className="bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-700 bg-clip-text text-transparent font-black">
        {children}
    </span>
);

// 6. Midnight Obsidian (Dark Theme)
export const MidnightText = ({ children }) => (
    <span className="bg-gradient-to-br from-slate-300 via-slate-500 to-slate-900 bg-clip-text text-transparent font-bold tracking-tight">
        {children}
    </span>
);

// 7. Bubblegum (Playful)
export const CandyText = ({ children }) => (
    <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent font-extrabold">
        {children}
    </span>
);

// 8. Volcanic Ash (Industrial)
export const VolcanicText = ({ children }) => (
    <span className="bg-gradient-to-t from-gray-900 via-red-900 to-orange-600 bg-clip-text text-transparent font-black uppercase">
        {children}
    </span>
);

// 9. Hyper-Ice (Clean/SaaS)
export const IceText = ({ children }) => (
    <span className="bg-gradient-to-r from-blue-200 to-cyan-400 bg-clip-text text-transparent font-semibold">
        {children}
    </span>
);

// 10. Cosmic Mesh (Animated-ready)
export const CosmicText = ({ children }) => (
    <span className="bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-black animate-gradient">
        {children}
    </span>
);