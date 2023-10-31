import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { insertTripSchema, trips, users } from "~/server/db/schema";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { nanoid } from "nanoid";
import { desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

export const tripsRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const newTrip = await db
      .insert(trips)
      .values({
        id: nanoid(20),
        userId: ctx.userId!,
      })
      .returning({ insertedId: trips.id })
      .then((newTrip) => newTrip[0]);

    const userTrips = await db
      .select({ tripIds: users.tripIds })
      .from(users)
      .where(eq(users.id, ctx.userId!))
      .then((userTrips) => userTrips[0]);

    if (!newTrip?.insertedId) return;

    if (userTrips?.tripIds) {
      await db
        .update(users)
        .set({ tripIds: [...userTrips.tripIds, newTrip.insertedId] })
        .where(eq(users.id, ctx.userId!));
    } else {
      await db
        .update(users)
        .set({ tripIds: [newTrip.insertedId] })
        .where(eq(users.id, ctx.userId!));
    }

    return {
      newTripId: newTrip.insertedId,
    };
  }),
  getDetailsById: protectedProcedure
    .input(z.object({ tripId: z.string() }))
    .query(async ({ input }) => {
      const currentTrip = await db
        .select()
        .from(trips)
        .where(eq(trips.id, input.tripId));
      return currentTrip[0];
    }),
  getSummariesByUser: protectedProcedure.query(async ({ ctx }) => {
    const tripDetails = await db
      .select({
        id: trips.id,
        userId: trips.userId,
        name: trips.name,
        summary: trips.summary,
        departureDate: trips.departureDate,
        returnDate: trips.returnDate,
        duration: trips.duration,
      })
      .from(trips)
      .where(eq(trips.userId, ctx.userId!));
    return tripDetails;
  }),
  update: protectedProcedure
    .input(z.object({ tripDetails: insertTripSchema }))
    .mutation(async ({ input }) => {
      const updatedTrip = await db
        .update(trips)
        .set({
          id: input.tripDetails.id,
          name: input.tripDetails.name,
          departureDate: input.tripDetails.departureDate,
          returnDate: input.tripDetails.returnDate,
          duration: input.tripDetails.duration,
        })
        .where(eq(trips.id, input.tripDetails.id))
        .returning({ updatedId: trips.id })
        .then((updatedTrip) => updatedTrip[0]);
      if (!updatedTrip) return { message: "Trip not found" };
      return { success: true };
    }),
  updatePlan: protectedProcedure
    .input(
      z.object({
        tripId: z.string(),
        purpose: z.string(),
        plan: z.object({
          title: z.string(),
          location: z.string(),
          locationCity: z.string(),
          locationCountry: z.string(),
          summary: z.string(),
          startDate: z.date(),
          endDate: z.date(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const updatedTrip = await db
        .update(trips)
        .set({ plan: input.plan })
        .returning({ updatedId: trips.id })
        .then((updatedTrip) => updatedTrip[0]);
      if (!updatedTrip) return { message: "Couldn't update trip plan" };
      return { success: true };
    }),
});
