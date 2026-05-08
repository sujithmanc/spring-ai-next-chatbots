// Project: Product Catalog
// Manage products, pricing and inventory

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { productSchema } from './validations'
import { createProduct, updateProduct, deleteProduct } from './service'

export async function createProductAction(prevState, formData) {
  const raw = {
    name: formData.get('name'),
    price: formData.get('price'),
    category: formData.get('category'),
    description: formData.get('description'),
    launchDate: formData.get('launchDate'),
    tags: formData.getAll('tags'),
    inStock: formData.get('inStock') === 'on',
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors,
      values: raw
    }
  }

  const { name, price, category, description, launchDate, tags, inStock } = parsed.data

  try {
    await createProduct({ name, price, category, description, launchDate, tags, inStock })
  } catch {
    return { success: false, message: 'Failed to create Product. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/products')
  redirect('/products')
}

export async function updateProductAction(id, formData) {
  const raw = formData

  const parsed = productSchema.safeParse(raw)
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
      await updateProduct(id, parsed.data)
    } else {
      await createProduct(parsed.data)
    }
  } catch {
    return { success: false, message: 'Failed to update Product. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/products')
  redirect('/products')
}

export async function deleteProductAction(id) {
  try {
    await deleteProduct(id)
  } catch {
    return { success: false, message: 'Failed to delete Product.' }
  }
  revalidatePath('/products')
}
