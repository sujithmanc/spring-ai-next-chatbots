import React from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import UserProfile from './UserProfile';
import { GoldenText } from './Gradients';

export default function Team() {
    const teamMembers = [
        {
            name: "Parveen Anand",
            role: "Lead Designer",
            img: "img/team/1.jpg",
            social: { twitter: "#", facebook: "#", linkedin: "#" }
        },
        {
            name: "Diana Petersen",
            role: "Lead Marketer",
            img: "img/team/2.jpg",
            social: { twitter: "#", facebook: "#", linkedin: "#" }
        },
        {
            name: "Larry Parker",
            role: "Lead Developer",
            img: "img/team/3.jpg",
            social: { twitter: "#", facebook: "#", linkedin: "#" }
        },
        {
            name: "Sujith Manchala",
            role: "Full Stack Developer",
            img: "img/team/4.jpg",
            social: { twitter: "#", facebook: "#", linkedin: "#" }
        }
    ];

    return (
        <section className="py-24 bg-slate-50" id="team">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black uppercase tracking-tighter">
                        <GoldenText>Our Amazing Team</GoldenText>
                    </h2>
                    <h3 className="text-lg text-slate-500 italic mt-4">
                        Lorem ipsum dolor sit amet consectetur.
                    </h3>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {teamMembers.map((member, index) => (
                        <UserProfile member={member} index={index} />
                    ))}
                </div>

                {/* Footer Text */}
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-slate-500 leading-relaxed italic font-serif">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut eaque, laboriosam veritatis, quos non quis ad perspiciatis, totam corporis ea, alias ut unde.
                    </p>
                </div>
            </div>
        </section>
    );
};