import React from 'react';
import { User } from 'lucide-react';

export default function STextField({
    label,
    icon: Icon = User, // Default to User icon if none provided
    type = "text",
    placeholder = "Sujith Manchala",
    register, // Pass the register function from react-hook-form
    name, // The specific field name (e.g., "username", "email")
    error, // Pass the specific error object for this field
    ...rest // Capture any other props (disabled, readOnly, etc.)
}) {
    return (
        <div className="form-control w-full">
            {label && (
                <label className="label" htmlFor={name}>
                    <span className="label-text">{label}</span>
                </label>
            )}

            <label className={`input input-bordered flex items-center gap-2 w-full ${error ? "input-error" : ""}`}>
                {/* Dynamically render the passed Icon component */}
                <Icon size={16} className="opacity-70 flex-shrink-0" />

                <input
                    id={name}
                    type={type}
                    className="grow w-full bg-transparent focus:outline-none"
                    placeholder={placeholder}
                    {...(register ? register(name) : {})} // Safely apply register if it exists
                    {...rest}
                />
            </label>

            {/* Display error message if it exists */}
            {error && (
                <span className="text-error text-xs mt-1 animate-pulse">
                    {error.message}
                </span>
            )}
        </div>
    );
}
