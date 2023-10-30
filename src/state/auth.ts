import { computed, observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { type ProcessedAuthServerResponse } from "amadeus/auth";

configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage,
});

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
});
