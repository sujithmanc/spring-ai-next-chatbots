
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { HOME_PAGE } from '../topics/util/constants'
import { subtopicActionDataSchema } from './subTopicSchema'
import db from '@/drizzle'
import { subtopics } from '@/drizzle/schema'
import { eq, inArray } from 'drizzle-orm'

export async function addSubtopics({ topicId, subtopics: lines }) {
  try {
    console.info('Adding subtopics:', { topicId, lines })
    const existing = await db
      .select({ name: subtopics.name })
      .from(subtopics)
      .where(inArray(subtopics.name, lines))

    const dupeSet = new Set(existing.map(r => r.name.toLowerCase()))
    console.info('Existing subtopics:', existing.map(r => r.name))
    const toInsert = []
    const results = lines.map(name => {
      if (dupeSet.has(name.toLowerCase())) {
        return { name, status: 'duplicate' }
      }
      toInsert.push({ name, topicId })
      return { name, status: 'added' }
    })

    console.info('Subtopics to insert:', JSON.stringify(toInsert, null, 2))
    if (toInsert.length > 0) {
      console.log('Inserting subtopics:', JSON.stringify(toInsert, null, 2))
      await db.insert(subtopics).values(toInsert)
    }

    const added = results.filter(r => r.status === 'added').length
    const dupes = results.filter(r => r.status === 'duplicate').length

    return {
      success: true,
      message: `${added} subtopic${added !== 1 ? 's' : ''} added${dupes > 0 ? `, ${dupes} duplicate${dupes !== 1 ? 's' : ''} skipped` : ''}.`,
      errors: {},
      results,
      stats: { total: lines.length, added, dupes },
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      errors: {},
      results: [],
      stats: { total: 0, added: 0, dupes: 0 },
    }
  }
}


export async function loadSubtopics(topicId) {
  const rows = await db
    .select({ name: subtopics.name })
    .from(subtopics)
    .where(eq(subtopics.topicId, topicId))
    .orderBy(subtopics.name)
  return rows
}