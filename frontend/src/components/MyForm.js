"use client";

import { useForm } from "react-hook-form";
import { Mail, User, Lock } from "lucide-react";
import STextField from "./ui-input/STextField";

export default function MyForm() {
    const { register, formState: { errors } } = useForm();

    return (
        <form className="p-4 space-y-4 max-w-sm">

            {/* 1. Username Field */}
            <STextField
                label="Username"
                name="username"       // Matches your Zod schema key
                register={register}   // Connects to Hook Form
                error={errors.username} // Connects to Errors
                placeholder="johndoe123"
                icon={User}           // Custom Icon
            />

            {/* 2. Email Field */}
            <STextField
                label="Email Address"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                placeholder="john@example.com"
                icon={Mail}           // Different Icon
            />

            {/* 3. Password Field */}
            <STextField
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                placeholder="******"
                icon={Lock}
            />

        </form>
    );
}