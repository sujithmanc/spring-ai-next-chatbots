"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, AtSign, Mail, Calendar, Save, RotateCcw } from "lucide-react";

// 1. Zod Schema (Unchanged)
const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  dob: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: "A valid date is required",
  }),
  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
});

export default function EmployeeForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
        className="card w-full max-w-lg bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold mb-4">Employee Registration</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* --- Name --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <label className={`input input-bordered flex items-center gap-2 w-full ${errors.name ? "input-error" : ""}`}>
                <User size={16} className="opacity-70" />
                <input 
                  type="text" 
                  className="grow" 
                  placeholder="John Doe" 
                  {...register("name")} 
                />
              </label>
              {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
            </div>

            {/* --- Username --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <label className={`input input-bordered flex items-center gap-2 ${errors.username ? "input-error" : ""}`}>
                <AtSign size={16} className="opacity-70" />
                <input 
                  type="text" 
                  className="grow" 
                  placeholder="johndoe123" 
                  {...register("username")} 
                />
              </label>
              {errors.username && <span className="text-error text-xs mt-1">{errors.username.message}</span>}
            </div>

            {/* --- Email --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className={`input input-bordered flex items-center gap-2 ${errors.email ? "input-error" : ""}`}>
                <Mail size={16} className="opacity-70" />
                <input 
                  type="email" 
                  className="grow" 
                  placeholder="info@site.com" 
                  {...register("email")} 
                />
              </label>
              {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
            </div>

            {/* --- Date of Birth --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <label className={`input input-bordered flex items-center gap-2 ${errors.dob ? "input-error" : ""}`}>
                <Calendar size={16} className="opacity-70" />
                <input 
                  type="date" 
                  className="grow" 
                  {...register("dob")} 
                />
              </label>
              {errors.dob && <span className="text-error text-xs mt-1">{errors.dob.message}</span>}
            </div>

            {/* --- Gender --- */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text font-semibold">Gender:</span>
              </label>
              <div className="flex gap-6">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Male</span>
                  <input 
                    type="radio" 
                    value="Male" 
                    className="radio radio-primary" 
                    {...register("gender")} 
                  />
                </label>
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Female</span>
                  <input 
                    type="radio" 
                    value="Female" 
                    className="radio radio-primary" 
                    {...register("gender")} 
                  />
                </label>
              </div>
              {errors.gender && <span className="text-error text-xs mt-1">{errors.gender.message}</span>}
            </div>

            {/* --- Skills --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Skills</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {["Java", "React", "NextJs"].map((skill) => (
                  <label key={skill} className="label cursor-pointer gap-2 border border-base-300 rounded-lg px-3 py-1 hover:bg-base-200">
                    <span className="label-text">{skill}</span>
                    <input 
                      type="checkbox" 
                      value={skill} 
                      className="checkbox checkbox-sm checkbox-primary" 
                      {...register("skills")} 
                    />
                  </label>
                ))}
              </div>
              {errors.skills && <span className="text-error text-xs mt-1">{errors.skills.message}</span>}
            </div>

            {/* --- Actions --- */}
            <div className="card-actions justify-end mt-6">
              <button 
                type="button" 
                onClick={() => reset()} 
                className="btn btn-ghost gap-2"
              >
                <RotateCcw size={18} /> Reset
              </button>
              <button 
                type="submit" 
                className="btn btn-primary gap-2"
              >
                <Save size={18} /> Submit
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}