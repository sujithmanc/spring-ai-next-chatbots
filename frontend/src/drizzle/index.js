import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import * as scheme from "./schema";

export const db = drizzle(
    {
        schema : scheme,
        mode: "default",
        connection: process.env.DATABASE_URL,
        casing: 'snake_case',
        logger: true
    }
)
export default db;