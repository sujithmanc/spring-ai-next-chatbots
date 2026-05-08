import { relations } from "drizzle-orm";
import { bigint, boolean, int, mysqlTable as table, text } from "drizzle-orm/mysql-core";
import {
  mysqlTable,
  serial,
  varchar,
  date,
  mysqlEnum,
  json,
  timestamp,
} from "drizzle-orm/mysql-core";


export const userRoles = ["guest", "user", "admin"];
export const genderType = ["Male", "Female", "Other"];


export const users = table("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  dob: date("dob"),
  gender: mysqlEnum("gender", genderType),
  role: mysqlEnum("role", userRoles).default("guest"),
  skills: json("skills").$type(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// QA Notes table
export const qaNotes = mysqlTable("qa_notes", {
  id: serial("id").autoincrement().primaryKey(),

  que: text("que").notNull(),
  ans: text("ans").notNull(),

  // ISO date: YYYY-MM-DD
  date: varchar("date", { length: 10 }).notNull(),
  topic: varchar("topic", { length: 16 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const employees = mysqlTable('employees', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  age: int('age'),
  dOB: date('dOB'),
  desc: text('desc'),
  gender: varchar('gender', { length: 255 }),
  skills: varchar('skills', { length: 255 }),
  city: varchar('city', { length: 255 }),
  active: boolean('active').default(false),
})


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

export const topics = mysqlTable('topics', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 16 }).unique(),
});

export const subtopics = mysqlTable('subtopics', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 32 }).notNull().unique(),
  topicId: bigint('topic_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => topics.id),
});

export const topicsRelations = relations(topics, ({ many }) => ({
  subtopics: many(subtopics),
}));

export const subtopicsRelations = relations(subtopics, ({ one }) => ({
  topic: one(topics, {
    fields: [subtopics.topicId],
    references: [topics.id],
  }),
}));


// 1. Re-export EVERYTHING from your other schema file(s)
// This must point to the correct relative path of the file
export * from "./promptbox-schema.js";