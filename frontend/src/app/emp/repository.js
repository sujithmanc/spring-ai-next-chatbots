// Project: Employee Management System
// Used to manage the whole employee system

import db from '@/drizzle'
import { employees } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

function serialize(data) {
  const d = { ...data }
  if (Array.isArray(d.skills)) d.skills = JSON.stringify(d.skills)
  return d
}

function deserialize(row) {
  if (!row) return row
  const d = { ...row }
  if (typeof d.skills === 'string') d.skills = JSON.parse(d.skills)
  return d
}

export async function findAll() {
  const rows = await db.select().from(employees)
  return rows.map(deserialize)
}

export async function findById(id) {
  const rows = await db.select().from(employees).where(eq(employees.id, id))
  return deserialize(rows[0] ?? null)
}

export async function insert(data) {
  return db.insert(employees).values(serialize(data))
}

export async function update(id, data) {
  return db.update(employees).set(serialize(data)).where(eq(employees.id, id))
}

export async function remove(id) {
  return db.delete(employees).where(eq(employees.id, id))
}
