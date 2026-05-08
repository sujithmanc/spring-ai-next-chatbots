import React from 'react'
import { Twitter, Facebook, Linkedin } from 'lucide-react';

export default function UserProfile({ member, index }) {
    return (
        <div key={index} className="flex flex-col items-center text-center group">
            {/* Profile Image with Border */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-full scale-0 group-hover:scale-105 transition-transform duration-300 -z-10 opacity-10"></div>
                <img
                    className="w-56 h-56 rounded-full border-[8px] border-slate-200 object-cover shadow-lg group-hover:border-blue-100 transition-colors duration-300"
                    src={member.img}
                    alt={member.name}
                />
            </div>

            <h4 className="text-2xl font-bold text-slate-900">{member.name}</h4>
            <p className="text-slate-500 mb-6">{member.role}</p>

            {/* Social Buttons */}
            <div className="flex space-x-4">
                <a href={member.social.twitter} className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md">
                    <Twitter size={20} fill="currentColor" />
                </a>
                <a href={member.social.facebook} className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md">
                    <Facebook size={20} fill="currentColor" />
                </a>
                <a href={member.social.linkedin} className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md">
                    <Linkedin size={20} fill="currentColor" />
                </a>
            </div>
        </div>
    )
}
