// Project: Flash card Topics
// Used to manage the whole employee system

import { z } from 'zod'

export const topicSchema = z.object({
  name: z.string().min(4, 'Name is required').max(16, 'Name must be at most 16 characters'),
})
