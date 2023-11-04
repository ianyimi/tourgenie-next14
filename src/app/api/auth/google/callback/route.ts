/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { auth, googleAuth } from "~/server/auth/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { cookies, headers } from "next/headers";
import { nanoid } from "nanoid";

import type { NextRequest } from "next/server";
import { UserSchema } from "lucia";

export const GET = async (request: NextRequest) => {
  const storedState = cookies().get("google_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  console.log("successful state");
  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        userId: nanoid(20),
        attributes: {
          name: googleUser.name,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          email: googleUser.email,
          picture: googleUser.picture,
          emailVerified: googleUser.email_verified,
          locale: googleUser.locale,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard", // redirect to profile page
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
