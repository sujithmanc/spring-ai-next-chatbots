// Project: Flash card Topics
// Used to manage the whole employee system

import { mysqlTable, int, varchar, text, date, boolean, serial, json } from 'drizzle-orm/mysql-core'

export const topics = mysqlTable('topics', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
})
