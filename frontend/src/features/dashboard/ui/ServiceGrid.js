"use client";
import Link from 'next/link';
import React from 'react';

const ServiceGrid = ({ routes }) => {
  return (
    <div className="container mx-auto p-8">
      {/* 1. AUTO-FILL GRID: 
         This mimics the YTS gallery. Cards will be at least 240px wide 
         and will stretch to fill the row. No explicit breakpoints needed.
      */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
        
        {routes.map((route) => {
          const { path, label, Icon, description } = route;

          return (
            <Link 
              key={path} 
              href={path}
              className="group relative block h-full"
            >
              <div className="
                h-full flex flex-col
                bg-white rounded-xl overflow-hidden
                border-2 border-transparent
                /* The Base Shadow */
                shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                
                /* HOVER EFFECTS: Deep Shadow, Lift, and Border Color */
                transition-all duration-300 ease-out
                group-hover:shadow-2xl
                group-hover:-translate-y-2
                group-hover:border-green-400
              ">
                
                {/* Top Section: "The Poster" 
                   Dark background to make the icon pop like a movie thumbnail 
                */}
                <div className="
                  h-40 w-full 
                  bg-gray-900 
                  flex items-center justify-center
                  group-hover:bg-gray-800 transition-colors
                ">
                  <Icon 
                    size={64} 
                    className="text-gray-400 group-hover:text-green-400 transition-colors duration-300" 
                    strokeWidth={1.5}
                  />
                </div>

                {/* Bottom Section: Content */}
                <div className="p-5 flex-grow flex flex-col border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-green-600 transition-colors">
                    {label}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {description || "Manage this section settings."}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceGrid;