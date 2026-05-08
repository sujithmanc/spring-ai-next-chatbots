// Project: Flash card Topics
// Used to manage the whole employee system

import db from '@/drizzle'
import { topics } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function findAll() {
  const rows = await db.select().from(topics)
  return rows
}

export async function findById(id) {
  const rows = await db.select().from(topics).where(eq(topics.id, id))
  return rows[0] ?? null
}

export async function insert(data) {
  return db.insert(topics).values(data)
}

export async function update(id, data) {
  return db.update(topics).set(data).where(eq(topics.id, id))
}

export async function remove(id) {
  return db.delete(topics).where(eq(topics.id, id))
}
