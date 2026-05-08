// Project: Product Catalog
// Manage products, pricing and inventory

import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'name is required').max(100, 'name must be at most 100 characters'),
  price: z.coerce.number().min(0, 'price must be at least 0').max(999999, 'price must be at most 999999'),
  category: z.string().min(1, 'category is required'),
  description: z.string().optional(),
  launchDate: z.string().optional()
  .refine(v => new Date(v) >= new Date('2000-01-01'), 'launchDate must be after 2000-01-01')
  .refine(v => new Date(v) <= new Date('2030-12-31'), 'launchDate must be before 2030-12-31'),
  tags: z.array(z.string()).min(1, 'Select at least 1 option for tags'),
  inStock: z.literal(true, { errorMap: () => ({ message: 'inStock must be enabled' }) }),
})
