import React from 'react';
import { Plus } from 'lucide-react'; // Using Lucide for the "plus" icon
import { GoldenText } from './Gradients';

export default function Portfolio() {
  const portfolioItems = [
    { title: "Threads", sub: "Illustration", img: "img/portfolio/1.jpg" },
    { title: "Explore", sub: "Graphic Design", img: "img/portfolio/2.jpg" },
    { title: "Finish", sub: "Identity", img: "img/portfolio/3.jpg" },
    { title: "Lines", sub: "Branding", img: "img/portfolio/4.jpg" },
    { title: "Southwest", sub: "Website Design", img: "img/portfolio/5.jpg" },
    { title: "Window", sub: "Photography", img: "img/portfolio/6.jpg" },
  ];

  return (
    <section className="py-24 bg-slate-50" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">
            <GoldenText>Portfolio</GoldenText>
          </h2>
          <h3 className="text-lg text-slate-500 italic font-serif">
            Lorem ipsum dolor sit amet consectetur.
          </h3>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {portfolioItems.map((item, index) => (
            <div key={index} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">

              {/* Image Container with Hover Overlay */}
              <div className="relative overflow-hidden cursor-pointer">
                {/* The "Plus" Overlay */}
                <div className="absolute inset-0 z-10 bg-blue-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Plus size={64} className="text-white" strokeWidth={2.5} />
                </div>

                {/* Project Image */}
                <img
                  className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  src={item.img}
                  alt={item.title}
                />
              </div>

              {/* Caption Area */}
              <div className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900">{item.title}</div>
                <div className="text-slate-500 italic font-serif mt-1">{item.sub}</div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};