import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/mysql2";
import * as scheme from "./schema";

const db = drizzle({
    schema : scheme,
    mode: "default",
    connection: {
        password: env.DB_PASSWORD,
        user: env.DB_USER,
        database: env.DB_NAME,
        host: env.DB_HOST,
    },
})  