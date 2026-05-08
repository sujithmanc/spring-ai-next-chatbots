
import { eq } from "drizzle-orm";
import { db2 } from "./db-out";
import { users } from "./schema";

export const userService = {
    // 1. Get All Users
    getAll: async () => {
        return await db2.query.users.findMany();
    },

    // 2. Get One User by ID
    getOne: async (id) => {
        return await db2.query.users.findFirst({
            where: eq(users.id, id),
        });
    },

    // 3. Find User by Email
    findByEmail: async (email) => {
        return await db2.query.users.findFirst({
            where: eq(users.email, email),
        });
    },

    // 4. Insert User
    // Note: Drizzle returns a result object. Use .then() or await
    insert: async (data) => {
        try {
            const result = await db2.insert(users).values(data);
            console.log('Insert Result:', result);
            return result;
        } catch (error) {
            console.error('Error inserting user:', error);
            throw error;
        }
    },

    // 5. Update User
    update: async (id, data) => {
        return await db2.update(users)
            .set(data)
            .where(eq(users.id, id));
    },

    // 6. Delete User
    delete: async (id) => {
        return await db2.delete(users)
            .where(eq(users.id, id));
    },
};