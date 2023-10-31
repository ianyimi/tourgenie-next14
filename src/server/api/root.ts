import { createTRPCRouter } from "~/server/api/trpc";
import {
  mainRouter,
  citiesRouter,
  destinationSearchRouter,
  tripsRouter,
  userRouter,
} from "./routers";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  trip: tripsRouter,
  main: mainRouter,
  user: userRouter,
  destinationSearch: destinationSearchRouter,
  cities: citiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
