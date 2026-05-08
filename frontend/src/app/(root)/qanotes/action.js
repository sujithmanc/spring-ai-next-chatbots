"use server";

import { qaNotes } from "@/drizzle/schema";
import { parseQA } from "./parser";
import db from "@/drizzle";

export async function createNotes(prevState, formData) {
    try {
        const date = formData.get("date");
        const content = formData.get("content");
        const topic = formData.get("topic");

        if (!date || !content || !topic) {
            return {
                success: false,
                message: "Date and content are required",
            };
        }

        // Parse textarea → [{ que, ans }]
        const parsed = parseQA(content);

        if (!parsed.length) {
            return {
                success: false,
                message: "No valid Q&A found",
            };
        }

        // Prepare for DB insert
        const values = parsed.map((item) => ({
            que: item.que,
            ans: item.ans,
            topic,
            date,
        }));

        // Bulk insert
        await db.insert(qaNotes).values(values);

        return {
            success: true,
            message: `Saved ${values.length} notes`,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Something went wrong",
        };
    }
}