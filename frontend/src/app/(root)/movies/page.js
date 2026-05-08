"use client";

import SMovieCard from "@/components/cards/SMovieCard";

// Dummy Data
const movies = [
  { id: 1, title: "Inception", year: 2010, image: "https://image.tmdb.org/t/p/w500/9gk7admal4zl67YrxIo1IGeo62s.jpg" },
  { id: 2, title: "Interstellar", year: 2014, image: "https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahMcafCUYAzn1wMw.jpg" },
  { id: 3, title: "The Dark Knight", year: 2008, image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 4, title: "Dune: Part Two", year: 2024, image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
  { id: 5, title: "Oppenheimer", year: 2023, image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
  { id: 6, title: "Avengers: Endgame", year: 2019, image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
  { id: 7, title: "Joker", year: 2019, image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
  { id: 8, title: "Parasite", year: 2019, image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
];

export default function MovieGrid() {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">
        Latest Uploads
      </h2>

      {/* --- THE RESPONSIVE GRID --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-8">
        {movies.map((movie) => (
          <SMovieCard
            key={movie.id}
            title={movie.title}
            year={movie.year}
            image={movie.image}
            onClick={() => console.log("Clicked:", movie.title)}
          />
        ))}
      </div>
    </div>
  );
}