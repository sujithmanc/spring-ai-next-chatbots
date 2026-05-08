// Project: Flash card Topics
// Used to manage the whole employee system

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { topicSchema } from './validations'
import { createTopic, updateTopic, deleteTopic } from './service'
import { HOME_PAGE } from './util/constants'

export async function createOrUpdateTopicAction(id, formData) {
  const raw = formData

  const parsed = topicSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors,
      values: raw
    }
  }

  try {
    if (id) {
      await updateTopic(id, parsed.data)
    } else {
      await createTopic(parsed.data)
    }
  } catch (err) {
    console.info("Error: ", JSON.stringify(err, null, 2))
    if (err?.cause?.message) {
      return { success: false, message: err?.cause?.message, errors: {}, values: raw }
    }
    return { success: false, message: 'Failed to update Topic. Please try again.', errors: {}, values: raw }
  }

  revalidatePath(HOME_PAGE)
  redirect(HOME_PAGE)
}

export async function deleteTopicAction(id) {
  try {
    await deleteTopic(id)
  } catch {
    return { success: false, message: 'Failed to delete Topic.' }
  }
  revalidatePath(HOME_PAGE)
}
