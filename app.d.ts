/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { LuciaDatabaseSessionAttributes } from "@lucia-auth/oauth/dist/lucia";
type PropsWithChildren<P = unknown> = P & { children?: ReactNode };
type PropsWithClassName<P = unknown> = P & { className?: string };
type PropsWithChildrenAndClassName<P = unknown> = PropsWithClassName<P> &
  PropsWithChildren<P>;

interface UserAttributes {
  name: string;
  email?: string;
  picture: string;
  emailVerified?: boolean;
  locale: string;
  firstName: string;
  lastName: string;
}
interface UserAuthSession {
  user: { userId: string } & UserAttributes;
  sessionId: string;
  activePeriodExpiresAt: Date;
  idlePeriodExpiresAt: Date;
  state: "idle" | "active";
  fresh: boolean;
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    name: string;
    email?: string;
    picture: string;
    emailVerified?: boolean;
    locale: string;
    firstName: string;
    lastName: string;
  };
  type DatabaseSessionAttributes = LuciaDatabaseSessionAttributes;
}
