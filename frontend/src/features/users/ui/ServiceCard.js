"use client"
import React from 'react'

export default function ServiceCard({ service }) {
    return (
        <div key={service.id} className="flex flex-col items-center group text-center">

            {/* Circle Wrapper */}
            <div className="relative flex items-center justify-center w-40 h-40 mb-8">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-amber-600 rounded-full shadow-2xl shadow-amber-500/20 group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-500 ease-out"></div>

                {/* Lucide Icon Component */}
                <div className="relative z-10 text-white transform group-hover:rotate-12 transition-transform duration-500">
                    <service.Icon
                        size={64}      // Sizing in pixels
                        strokeWidth={1.5} // Adjusts the "weight" of the icon
                    />
                </div>
            </div>

            <h4 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h4>
            <p className="text-slate-500 text-lg leading-relaxed px-4">
                {service.desc}
            </p>
        </div>
    )
}
