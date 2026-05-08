import React from 'react'

export default function SCard({ children }) {
    return (
        <div className="card w-full bg-base-100 shadow-xl hover:shadow-2xl m-2 transition-shadow duration-300 border border-base-200">
            <div className="card-body p-6">
                {children}
            </div>
        </div>
    )
}
