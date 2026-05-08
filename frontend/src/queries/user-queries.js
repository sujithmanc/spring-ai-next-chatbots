
import db from "@/drizzle";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAllUsers() {
  return db.select().from(users).orderBy(users.createdAt);
}

export async function getUserById(id) {
  
    const [user] = await db.select().from(users).where(eq(users.id, id));
    console.info(id, JSON.stringify(user, null, 4));
 // const user = await db.query.users.findFirst();

  return user ?? null;
}