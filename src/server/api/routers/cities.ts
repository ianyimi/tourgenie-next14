import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { cities, insertCitySchema } from "~/server/db/schema";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  restrictedProcedure,
} from "~/server/api/trpc";
import { desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

export const citiesRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({ city: z.string().optional(), country: z.string().optional() }),
    )
    .mutation(async ({ input }) => {
      if (input.country) {
        const citiesByCountry = await db
          .select()
          .from(cities)
          .where(eq(cities.country, input.country))
          .orderBy(desc(cities.population))
          .limit(5);
        return citiesByCountry;
      }
      if (input.city) {
        const citiesByName = await db
          .select()
          .from(cities)
          .where(eq(cities.name, input.city));
        return citiesByName;
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Must provide city or country",
      });
    }),
  upload: restrictedProcedure
    .input(
      z.object({
        city: insertCitySchema,
        minPopulation: z.number().optional(),
      }),
    )
    .mutation(async ({ input: { city, minPopulation = 250000 } }) => {
      if (city.population && city.population < minPopulation) {
        return {
          success: false,
          message: "City population is less than ${minPopulation}... Skipping.",
        };
      }
      const existingCity = await db
        .select({ name: cities.name })
        .from(cities)
        .where(eq(cities.name, city.name));
      if (existingCity.length > 0) {
        return {
          success: false,
          message: `City ${city.name} already exists in database`,
        };
      }
      console.log(`Inserting city ${city.name}`);
      await db.insert(cities).values(city);
      console.log(`Finished. inserted city ${city.name}.`);
      return { success: true };
    }),
  prune: restrictedProcedure
    .input(z.object({ minPopulation: z.number() }))
    .mutation(async ({ input }) => {
      const prunedCities: { name: string }[] = await db
        .delete(cities)
        .where(lt(cities.population, input.minPopulation))
        .returning({ name: cities.name });

      return prunedCities;
    }),
});
