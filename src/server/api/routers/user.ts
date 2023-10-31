/* eslint-disable @typescript-eslint/no-unsafe-return */
import { db } from "~/server/db";
import { insertUserSchema, users } from "~/server/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Activities, type UserDetails } from "~/state/user";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  test: publicProcedure.mutation(({ ctx }) => {
    console.log("ctx.userId", ctx.userId);
    return { success: true };
  }),
  create: publicProcedure.input(insertUserSchema).query(async ({ input }) => {
    const insertedUser = await db
      .insert(users)
      .values({
        ...input,
        tripIds: [],
        travelPreferences: {
          budget: "",
          preferredTransportation: "",
          preferredAccommodation: "",
          preferredActivities: "",
          dietaryRestrictions: [],
          accessibilityRequirements: [],
          travelerIds: [],
          travelGroup: [],
          activities: [],
        },
        personalInfo: {
          name: "",
          firstName: "",
          lastName: "",
          hobbies: [],
          languages: [],
          age: 0,
        },
      })
      .returning({ insertedId: users.id })
      .then((users) => users[0]);

    if (!insertedUser?.insertedId) return;

    return {
      id: insertedUser.insertedId,
    };
  }),
  getTravelPreferences: protectedProcedure.query(async ({ ctx }) => {
    const user = await db
      .select({ travelPreferences: users.travelPreferences })
      .from(users)
      .where(eq(users.id, ctx.userId!))
      .then((users) => users[0]);
    return user?.travelPreferences;
  }),
  getProfileInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await db
      .select({ personalInfo: users.personalInfo })
      .from(users)
      .where(eq(users.id, ctx.userId!))
      .then((users) => users[0]);
    return user?.personalInfo;
  }),
  updateTravelPreferences: protectedProcedure
    .input(
      z.object({
        budget: z.string().optional(),
        preferredTransportation: z.string().optional(),
        preferredAccommodation: z.string().optional(),
        preferredActivities: z.string().optional(),
        dietaryRestrictions: z.array(
          z.enum([
            "None",
            "Vegetarian",
            "Vegan",
            "Gluten Free",
            "Lactose Intolerant",
            "Kosher",
            "Halal",
          ]),
        ),
        accessibilityRequirements: z.array(
          z.enum(["None", "Wheelchair", "Blind", "Deaf"]),
        ),
        travelerIds: z.array(z.string()).optional(),
        travelGroup: z.array(z.string()),
        activities: z.array(z.enum(["None", ...Object.values(Activities)])),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedPreferences = await db
        .update(users)
        .set({
          travelPreferences: input,
        })
        .where(eq(users.id, ctx.userId!))
        .returning({ travelPreferences: users.travelPreferences })
        .then((users) => users[0]);
      return updatedPreferences?.travelPreferences;
    }),
  updatePersonalInfo: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        hobbies: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
        age: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedPersonalInfo = await db
        .update(users)
        .set({
          personalInfo: input,
        })
        .where(eq(users.id, ctx.userId!))
        .returning({ personalInfo: users.personalInfo })
        .then((users) => users[0]);
      return updatedPersonalInfo?.personalInfo;
    }),
});
