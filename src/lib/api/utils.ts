/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { apiAuthState$, type ApiAuthState } from "~/state/auth";
import type { AuthServerResponse } from "~/types/api/amadeus";

export const createApiAuthRequestOptions = (
  accessToken: string,
  options: RequestInit,
) => ({
  ...options,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  },
});

async function fetchTempApiKey() {
  console.info(`fetching api key...`);
  const authServerResponse = await fetch("/api/auth", { method: "POST" });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const authServerResponseData: AuthServerResponse =
    await authServerResponse.json();

  apiAuthState$.set({
    access_token: authServerResponseData.access_token,
    expires_at: authServerResponseData.expires_in * 1000 + Date.now(),
  });

  return apiAuthState$.get();
}

export async function validateApiRequests(forceRefresh = false) {
  if (
    !forceRefresh &&
    apiAuthState$.access_token.get() !== "" &&
    apiAuthState$.expires_at.get() > Date.now()
  ) {
    console.log(
      "api key already exists and is valid. Time till expiry (s):  ",
      (apiAuthState$.expires_at.get() - Date.now()) / 1000,
    );
    console.log((apiAuthState$.expires_at.get() - Date.now()) / 1000);
    return apiAuthState$.get();
  } else if (!forceRefresh && localStorage.getItem("apiAuthState")) {
    const authData: ApiAuthState = JSON.parse(
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      localStorage.getItem("apiAuthState") as string,
    );
    if (authData.access_token !== "" && authData.expires_at > Date.now()) {
      apiAuthState$.set({ ...authData });
      console.log("skipping api key fetch...");
      return authData;
    } else if (authData.access_token.length > 0) {
      console.log("api key expired. fetching new api key...");
      return await fetchTempApiKey();
    }
  }

  console.log(
    "no pre-existing api auth data found. Force fetching new api key...",
  );
  return await fetchTempApiKey();
}

export function validateApiKey() {
  if (
    apiAuthState$.access_token.get() !== "" &&
    apiAuthState$.expires_at.get() > Date.now()
  )
    return true;

  return false;
}
