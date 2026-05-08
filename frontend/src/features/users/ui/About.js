import React from 'react';
import { GoldenText } from './Gradients';

export default function About() {
    const events = [
        { date: "2009-2011", title: "Our Humble Beginnings", desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam.", img: "img/about/1.jpg" },
        { date: "March 2011", title: "An Agency is Born", desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam.", img: "img/about/2.jpg" },
        { date: "December 2015", title: "Transition to Full Service", desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam.", img: "img/about/3.jpg" },
        { date: "July 2020", title: "Phase Two Expansion", desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam.", img: "img/about/4.jpg" }
    ];

    return (
        <section className="py-24 bg-white" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black uppercase tracking-tighter">
                        <GoldenText>About</GoldenText>
                    </h2>
                    <h3 className="text-lg text-slate-500 italic mt-4">Lorem ipsum dolor sit amet consectetur.</h3>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical Line (Hidden on mobile, visible on MD+) */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-slate-200 hidden md:block"></div>

                    <div className="space-y-12 md:space-y-24">
                        {events.map((event, index) => (
                            <div key={index} className={`flex flex-col md:flex-row items-center justify-between w-full ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Content Panel */}
                                <div className="w-full md:w-[42%] text-center md:text-right px-4 order-2 md:order-1 mt-6 md:mt-0">
                                    <div className={`flex flex-col ${index % 2 !== 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}>
                                        <h4 className="text-xl font-bold text-slate-400">{event.date}</h4>
                                        <h4 className="text-2xl font-black text-slate-900 mb-3">{event.title}</h4>
                                        <p className="text-slate-500 leading-relaxed">{event.desc}</p>
                                    </div>
                                </div>

                                {/* Image Circle */}
                                <div className="relative z-10 w-32 h-32 md:w-44 md:h-44 flex-shrink-0 order-1 md:order-2">
                                    <img
                                        src={event.img}
                                        className="rounded-full border-[7px] border-slate-100 shadow-xl object-cover w-full h-full"
                                        alt={event.title}
                                    />
                                </div>

                                {/* Empty Space for balancing */}
                                <div className="hidden md:block md:w-[42%] order-3"></div>
                            </div>
                        ))}

                        {/* "Part of our story" Circle */}
                        <div className="flex justify-center">
                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-blue-600 border-[7px] border-slate-100 shadow-2xl flex items-center justify-center text-center p-4 z-10 transform hover:scale-105 transition-transform cursor-default">
                                <h4 className="text-white font-bold text-sm md:text-lg leading-tight uppercase">
                                    Be Part<br />Of Our<br />Story!
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};