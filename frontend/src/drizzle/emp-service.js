import { eq } from "drizzle-orm";
import db from "@/drizzle/index.js";
import { emp } from "../../drizzle/schema";

export const EmployeeService = {    
    /**
     * Create - Insert a new employee
     */
    create: async (data) => {
        // Returns an array containing information about the insert
        return await db.insert(emp).values(data);
    },

    /**
     * Read - Get all employees
     */
    getAll: async () => {
        return await db.select().from(emp);
    },

    /**
     * Read - Get one by ID
     */
    getById: async (id) => {
        const results = await db
            .select()
            .from(emp)
            .where(eq(emp.empId, id))
            .limit(1);

        return results[0] || null;
    },

    /**
     * Update - Modify existing employee
     */
    update: async (id, data) => {
        return await db
            .update(emp)
            .set(data)
            .where(eq(emp.empId, id));
    },

    /**
     * Delete - Remove employee
     */
    delete: async (id) => {
        return await db
            .delete(emp)
            .where(eq(emp.empId, id));
    }
};