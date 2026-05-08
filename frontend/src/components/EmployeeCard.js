"use client";
import React from "react";
import { Mail, Calendar, User, Trash2, Edit, Eye, EyeIcon } from "lucide-react";
import SCard from "./cards/SCard";




export default function EmployeeCard({ data, onDelete = () => { }, onEdit = () => { } }) {
    // Fallback if data is missing
    if (!data) return null;

    // Helper to get initials (e.g. "Rahul Sharma" -> "RS")
    const getInitials = (name) => {
        return name
            ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
            : "??";
    };

    return (
        <SCard>

            {/* --- Header: Avatar & Name --- */}
            <div className="flex items-center gap-4 mb-4">
                <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                        {getInitials(data.name)}
                    </div>
                </div>
                <div>
                    <h2 className="card-title text-xl font-bold text-base-content">
                        {data.name}
                    </h2>
                    <p className="text-sm text-base-content/60 font-medium">@{data.username}</p>
                </div>
            </div>

            <div className="divider my-0"></div>

            {/* --- Details Section --- */}
            <div className="space-y-3 mt-2">

                {/* Email */}
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-primary">
                        <Mail size={16} />
                    </div>
                    <span className="opacity-80">{data.email}</span>
                </div>

                {/* DOB & Gender Row */}
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-primary">
                            <Calendar size={16} />
                        </div>
                        <span className="opacity-80">{data.dob}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-primary">
                            <User size={16} />
                        </div>
                        <span className="badge badge-ghost badge-sm">{data.gender}</span>
                    </div>
                </div>
            </div>

            {/* --- Skills Badges --- */}
            <div className="mt-4">
                <p className="text-xs font-semibold opacity-50 uppercase mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                    {data.skills?.map((skill, index) => (
                        <span key={index} className="badge badge-outline badge-primary">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* --- Action Buttons (Outline Style) --- */}
            <div className="card-actions justify-end mt-6 pt-4 border-t border-base-200">
                <button
                    onClick={() => onEdit && onEdit(data)}
                    className="btn btn-sm btn-outline btn-info gap-2"
                >
                    <Edit size={16} /> Edit
                </button>
                <button
                    onClick={() => onDelete && onDelete(data)}
                    className="btn btn-sm btn-outline btn-error gap-2"
                >
                    <Trash2 size={16} /> Delete
                </button>
                <button
                    onClick={() => onDelete && onDelete(data)}
                    className="btn btn-sm btn-outline btn-primary gap-2"
                >
                    <EyeIcon size={16} /> View
                </button>
            </div>

        </SCard>
    );
}