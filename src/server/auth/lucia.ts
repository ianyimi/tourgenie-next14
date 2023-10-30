import { lucia } from "lucia";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { google } from "@lucia-auth/oauth/providers";
import { nextjs_future } from "lucia/middleware";
import postgres from "postgres";
import * as context from "next/headers";
import { tableNames } from "~/server/db/schema";
import "lucia/polyfill/node";

import { env } from "~/env.mjs";
import { cache } from "react";
import { type UserAuthSession } from "app";

const sql = postgres(env.DATABASE_CONNECTION_STRING);

export const auth = lucia({
  env: env.NODE_ENV === "production" ? "PROD" : "DEV",
  adapter: postgresAdapter(sql, tableNames),
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false, // only for projects deployed to the edge
  },
  getUserAttributes: (data) => {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      picture: data.picture,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  },
});

export const googleAuth = google(auth, {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.GOOGLE_REDIRECT_URI,
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
});

export type Auth = typeof auth;

export const getPageSession: () => Promise<UserAuthSession | null> = cache(
  () => {
    const authRequest = auth.handleRequest("GET", context);
    return authRequest.validate();
  },
);
