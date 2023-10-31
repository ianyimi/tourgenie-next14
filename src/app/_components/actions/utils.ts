"use server";
import { api } from "~/trpc/server";
import { revalidatePath } from "next/cache";

export async function createNewTrip() {
  await api.trip.create.mutate().then(
    () => {
      revalidatePath("/dashboard");
      console.log("Successfully created new trip");
      return { success: true };
    },
    () => {
      console.error("Failed to create new trip");
      return { message: "Failed to create new trip" };
    },
  );
}
