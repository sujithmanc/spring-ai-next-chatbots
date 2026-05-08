// Project: Employee Management System
// Used to manage the whole employee system

import { z } from 'zod'

export const employeeSchema = z.object({
  name: z.string().min(4, 'Name is required').max(16, 'Name must be at most 16 characters'),
  age: z.coerce.number().min(18, 'Age must be at least 18').max(60, 'Age must be at most 60'),
  dOB: z.string().optional()
  .refine(v => new Date(v) >= new Date('2000-01-01'), 'DOB must be after 2000-01-01')
  .refine(v => new Date(v) <= new Date('2030-01-01'), 'DOB must be before 2030-01-01'),
  desc: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  skills: z.array(z.string()).min(2, 'Select at least 2 options for Skills'),
  city: z.string().min(1, 'City is required'),
  active: z.literal(true, { errorMap: () => ({ message: 'Active must be enabled' }) }),
})
