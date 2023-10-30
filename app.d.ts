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

/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("./src/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    name: string;
    email?: string;
    picture: string;
    email_verified?: boolean;
    locale: string;
  };
  type DatabaseSessionAttributes = {};
}
