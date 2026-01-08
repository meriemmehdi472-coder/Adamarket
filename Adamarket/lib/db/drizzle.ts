// lib/db/drizzle.ts

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as appSchema from "./schema";
import * as authSchema from "./auth-schema"; // chemin depuis lib/db

const client = neon(process.env.DATABASE_URL!);

export const db = drizzle(client, {
  schema: {
    ...appSchema,
   ...authSchema,
  },
});
