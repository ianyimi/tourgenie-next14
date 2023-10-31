import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { type ProcessedAuthServerResponse } from "~/types/api/amadeus";

export type ApiAuthState = Pick<
  ProcessedAuthServerResponse,
  "access_token" | "expires_at"
>;

export const apiAuthState$ = observable<ApiAuthState>({
  access_token: "",
  expires_at: 0,
});

persistObservable<ApiAuthState>(apiAuthState$, {
  local: "apiAuthState",
  pluginLocal: ObservablePersistLocalStorage,
});
