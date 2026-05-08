"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, AtSign, Mail, Calendar, Save, RotateCcw, Briefcase } from "lucide-react";
import STextField from "./ui-input/STextField";


// --- Zod Schema ---
const employeeSchema = z.object({
  name: z.string().min(2, "Full Name is required"),
  username: z.string().min(3, "Username is too short"),
  email: z.string().email("Invalid email address"),
  dob: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: "Date of birth is required",
  }),
  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
});

export default function EmployeeForm02() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: { skills: [] },
  });

  const onSubmit = (data) => {
    console.log("Submitted:", data);
    alert("Employee Registered Successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card w-full max-w-2xl bg-base-100 shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-primary text-primary-content p-6 flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full">
                <Briefcase size={28} />
            </div>
            <div>
                <h2 className="text-2xl font-bold">New Employee</h2>
                <p className="text-sm opacity-90">Enter the details below to onboard staff.</p>
            </div>
        </div>

        <div className="card-body gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* --- Row 1: Name & Username (Grid) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <STextField
                label="Full Name"
                name="name"
                placeholder="e.g. Rahul Sharma"
                icon={User}
                register={register}
                error={errors.name}
              />
              <STextField
                label="Username"
                name="username"
                placeholder="e.g. rahul123"
                icon={AtSign}
                register={register}
                error={errors.username}
              />
            </div>

            {/* --- Row 2: Email & DOB (Grid) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <STextField
                label="Email Address"
                name="email"
                type="email"
                placeholder="rahul@company.com"
                icon={Mail}
                register={register}
                error={errors.email}
              />
              <STextField
                label="Date of Birth"
                name="dob"
                type="date"
                icon={Calendar}
                register={register}
                error={errors.dob}
              />
            </div>

            <div className="divider"></div>

            {/* --- Row 3: Gender & Skills --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Gender Section */}
                <div className="form-control">
                    <label className="label font-medium pb-1">Gender</label>
                    <div className="flex gap-4 p-3 border border-base-300 rounded-lg bg-base-50/50">
                        {["Male", "Female"].map((g) => (
                            <label key={g} className="cursor-pointer flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    value={g} 
                                    className="radio radio-primary radio-sm" 
                                    {...register("gender")} 
                                />
                                <span className="label-text">{g}</span>
                            </label>
                        ))}
                    </div>
                    {errors.gender && <span className="text-error text-xs mt-1">{errors.gender.message}</span>}
                </div>

                {/* Skills Section */}
                <div className="form-control">
                    <label className="label font-medium pb-1">Technical Skills</label>
                    <div className="flex flex-wrap gap-2 p-3 border border-base-300 rounded-lg bg-base-50/50">
                        {["Java", "React", "Next.js", "Python"].map((skill) => (
                            <label key={skill} className="cursor-pointer label p-0 gap-2 mr-2">
                                <input 
                                    type="checkbox" 
                                    value={skill} 
                                    className="checkbox checkbox-primary checkbox-xs rounded-md" 
                                    {...register("skills")} 
                                />
                                <span className="label-text">{skill}</span>
                            </label>
                        ))}
                    </div>
                    {errors.skills && <span className="text-error text-xs mt-1">{errors.skills.message}</span>}
                </div>
            </div>

            {/* --- Footer Actions --- */}
            <div className="card-actions justify-end mt-8 pt-4 border-t border-base-200">
              <button 
                type="button" 
                onClick={() => reset()} 
                className="btn btn-ghost hover:bg-base-200 gap-2"
              >
                <RotateCcw size={18} /> Reset Form
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-8 gap-2 shadow-lg shadow-primary/30"
              >
                <Save size={18} /> Signup
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}