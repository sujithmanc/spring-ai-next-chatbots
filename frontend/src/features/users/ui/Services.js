"use client"

import React from 'react';
import { mockServiceList } from '../lib/services';
import { GoldenText } from './Gradients';
import ServiceCard from './ServiceCard';

export default function Services() {
    return (
        <section className="py-24 bg-slate-50" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-24">
                    <h2 className="text-5xl font-black uppercase tracking-tighter">
                        <GoldenText>Our Services</GoldenText>
                    </h2>
                    <p className="mt-4 text-gray-500 font-medium italic">
                        Precision built solutions for the modern web.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                    {mockServiceList.map((service, index) => (
                        <ServiceCard service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

