import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { insertTripSchema, trips } from "~/server/db/schema";
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
      .returning({ insertedId: trips.id });

    if (!newTrip[0]?.insertedId) return;

    return {
      newTripId: newTrip[0].insertedId,
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
});
