// Project: Product Catalog
// Manage products, pricing and inventory

import { mysqlTable, int, varchar, text, date, boolean, serial, json } from 'drizzle-orm/mysql-core'

export const products = mysqlTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  price: int('price'),
  category: varchar('category', { length: 255 }),
  description: text('description'),
  launchDate: date('launchDate'),
  tags: json('tags'),
  inStock: boolean('inStock').default(false),
})
