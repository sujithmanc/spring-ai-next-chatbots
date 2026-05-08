import React from "react";

export default function SMovieCard({ title, year, image, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col gap-2 cursor-pointer w-full"
    >
      {/* --- Poster Image Container --- */}
      {/* aspect-[2/3] ensures it stays a perfect rectangle even if image loads slow */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-base-300 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
        
        {/* Optional: Dark gradient overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* --- Text Info --- */}
      <div className="px-1">
        <h3 className="text-sm font-bold leading-tight group-hover:text-primary truncate">
          {title}
        </h3>
        <p className="text-xs text-base-content/60 font-medium mt-0.5">
          {year}
        </p>
      </div>
    </div>
  );
}