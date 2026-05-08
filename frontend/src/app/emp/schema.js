// Project: Employee Management System
// Used to manage the whole employee system

import { mysqlTable, int, varchar, text, date, boolean, serial, json } from 'drizzle-orm/mysql-core'

export const employees = mysqlTable('employees', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  age: int('age'),
  dOB: date('dOB'),
  desc: text('desc'),
  gender: varchar('gender', { length: 255 }),
  skills: json('skills'),
  city: varchar('city', { length: 255 }),
  active: boolean('active').default(false),
})
