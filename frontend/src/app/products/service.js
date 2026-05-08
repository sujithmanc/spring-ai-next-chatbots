// Project: Product Catalog
// Manage products, pricing and inventory

import { findAll, findById, insert, update, remove } from './repository'

export async function getAllProducts() {
  return findAll()
}

export async function getProductById(id) {
  const record = await findById(Number(id))
  if (!record) throw new Error('Product not found')
  return record
}

export async function createProduct(data) {
  return insert(data)
}

export async function updateProduct(id, data) {
  await getProductById(id)
  return update(Number(id), data)
}

export async function deleteProduct(id) {
  await getProductById(id)
  return remove(Number(id))
}
