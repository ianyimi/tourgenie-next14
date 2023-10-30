/* eslint-disable @typescript-eslint/consistent-type-imports */
import { LuciaDatabaseUserAttributes } from "@lucia-auth/oauth/dist/lucia";
type PropsWithChildren<P = unknown> = P & { children?: ReactNode };
type PropsWithClassName<P = unknown> = P & { className?: string };
type PropsWithChildrenAndClassName<P = unknown> = PropsWithClassName<P> &
  PropsWithChildren<P>;

declare module "amadeus/auth" {
  interface AuthServerResponse {
    type: string;
    username: string;
    application_name: string;
    client_id: string;
    token_type: string;
    access_token: string;
    expires_in: number;
    state: string;
    scope: string;
  }

  interface ProcessedAuthServerResponse extends AuthServerResponse {
    expires_at: number;
  }
}

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
  type DatabaseUserAttributes = {} & UserAttributes;
  type DatabaseSessionAttributes = {};
}
