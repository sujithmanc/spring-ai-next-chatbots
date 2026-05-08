// Project: Product Catalog
// Manage products, pricing and inventory

import db from '@/drizzle'
import { products } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

function serialize(data) {
  const d = { ...data }
  if (Array.isArray(d.tags)) d.tags = JSON.stringify(d.tags)
  return d
}

function deserialize(row) {
  if (!row) return row
  const d = { ...row }
  if (typeof d.tags === 'string') d.tags = JSON.parse(d.tags)
  return d
}

export async function findAll() {
  const rows = await db.select().from(products)
  return rows.map(deserialize)
}

export async function findById(id) {
  const rows = await db.select().from(products).where(eq(products.id, id))
  return deserialize(rows[0] ?? null)
}

export async function insert(data) {
  return db.insert(products).values(serialize(data))
}

export async function update(id, data) {
  return db.update(products).set(serialize(data)).where(eq(products.id, id))
}

export async function remove(id) {
  return db.delete(products).where(eq(products.id, id))
}
