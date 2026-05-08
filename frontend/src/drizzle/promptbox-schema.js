import { eq, relations, sql } from "drizzle-orm";
import {
  mysqlTable,
  bigint,
  varchar,
  mysqlEnum,
  timestamp,
  text,
  int,
  unique,
  index,
  primaryKey,
  mysqlView,
} from "drizzle-orm/mysql-core";

// -----------------------------------------------------------------------------
// 1. Users Table
// -----------------------------------------------------------------------------
export const promptUsers = mysqlTable("prompt_users", {
  // Using mode: "number" so Drizzle returns standard JS numbers instead of BigInts
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const promptUsersRelations = relations(promptUsers, ({ many }) => ({
  nodes: many(nodes),
}));

// -----------------------------------------------------------------------------
// 2. Nodes Table (The Hierarchy)
// -----------------------------------------------------------------------------
export const nodes = mysqlTable(
  "nodes",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),

    // In plain JS, we can just use an arrow function without type casting
    parentId: bigint("parent_id", { mode: "number" }).references(
      () => nodes.id,
      { onDelete: "cascade" }
    ),

    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => promptUsers.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["folder", "document"]).notNull(),

    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => [
    // Ensures no two items have the same name in the exact same folder
    unique("uk_name_in_folder").on(table.parentId, table.name),
    // Speeds up queries fetching all files for a specific user
    index("idx_user_nodes").on(table.userId, table.deletedAt),
  ]
);

export const nodesRelations = relations(nodes, ({ one, many }) => ({
  user: one(promptUsers, {
    fields: [nodes.userId],
    references: [promptUsers.id],
  }),
  // Self-referencing relation for Parent -> Children navigation
  parent: one(nodes, {
    fields: [nodes.parentId],
    references: [nodes.id],
    relationName: "hierarchy",
  }),
  children: many(nodes, { relationName: "hierarchy" }),
  // Link to the text payload
  content: one(documentContents, {
    fields: [nodes.id],
    references: [documentContents.nodeId],
  }),
  // Many-to-many link to tags
  tags: many(documentTags),
}));

// -----------------------------------------------------------------------------
// 3. Document Contents Table
// -----------------------------------------------------------------------------
export const documentContents = mysqlTable("document_contents", {
  nodeId: bigint("node_id", { mode: "number" })
    .primaryKey()
    .references(() => nodes.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  wordCount: int("word_count").default(0),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft"),
});

export const documentContentsRelations = relations(documentContents, ({ one }) => ({
  node: one(nodes, {
    fields: [documentContents.nodeId],
    references: [nodes.id],
  }),
}));

// -----------------------------------------------------------------------------
// 4. Tags Table
// -----------------------------------------------------------------------------
export const tags = mysqlTable("tags", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  documents: many(documentTags),
}));

// -----------------------------------------------------------------------------
// 5. Document Tags (Junction/Pivot Table)
// -----------------------------------------------------------------------------
export const documentTags = mysqlTable(
  "document_tags",
  {
    nodeId: bigint("node_id", { mode: "number" })
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    tagId: bigint("tag_id", { mode: "number" })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    // Composite Primary Key guarantees a tag is only applied once per document
    primaryKey({ columns: [table.nodeId, table.tagId] }),
  ]
);

export const documentTagsRelations = relations(documentTags, ({ one }) => ({
  node: one(nodes, {
    fields: [documentTags.nodeId],
    references: [nodes.id],
  }),
  tag: one(tags, {
    fields: [documentTags.tagId],
    references: [tags.id],
  }),
}));


export const documentsWithTagsView = mysqlView("documents_with_tags_view").as((qb) =>
  qb.select({
    noteId: sql`${nodes.id}`.as("node_id"),
    parentId: sql`${nodes.parentId}`.as("parent_id"),
    userId: sql`${nodes.userId}`.as("user_id"),
    nodeName: sql`${nodes.name}`.as("node_name"),
    
    tagId: sql`${tags.id}`.as("tag_id"),
    tagName: sql`${tags.name}`.as("tag_name"),
    
    content: sql`${documentContents.content}`.as("content"),
  })
    .from(nodes)
    .innerJoin(documentTags, eq(nodes.id, documentTags.nodeId))
    .innerJoin(tags, eq(documentTags.tagId, tags.id))
    .innerJoin(documentContents, eq(nodes.id, documentContents.nodeId))
);

// sujith_id: sql`${nodes.id} AS sujith_id`,
//     parentId: sql`${nodes.parentId} AS parent_id`,
//     userId: sql`${nodes.userId} AS user_id`,
//     nodeName: sql`${nodes.name} AS node_name`,
    
//     tagId: sql`${tags.id} AS tag_id`,
//     tagName: sql`${tags.name} AS tag_name`,
    
//     content: sql`${documentContents.content} AS content`,

// `nodes`.`id`,
//      `nodes`.`parent_id`,
//      `nodes`.`user_id`,
//      `nodes`.`name` ,
//      `document_tags`.`node_id`,
//      `tags`.`id` as 'tag_id',
//      `tags`.`name` as 'tag_name'