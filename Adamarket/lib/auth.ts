import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/lib/db/drizzle";
import * as authSchema from "@/lib/db/auth-schema";
import {nextCookies} from "better-auth/next-js";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
   schema: authSchema,
  }),
  
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user"
      },
      isBanned: {
        type: "boolean",
        required: false,
        defaultValue: false
      }
    }
  },
  
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },  
    },
  callbacks: {
    session({ session, user }: any) {
      if (session.user && user) {
        session.user.role = user.role;
        session.user.isBanned = user.isBanned;
      }
      return session;
    },
  },
  plugins: [nextCookies()],
});
