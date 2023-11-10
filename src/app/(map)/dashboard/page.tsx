import { getPageSession } from "~/server/auth/lucia";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { nanoid } from "nanoid";
import { FaSpinner } from "react-icons/fa";
import NewTrip from "~/app/_components/NewTrip";
import TripCard from "~/app/_components/TripCard";
import PageFadeInOut from "~/app/_components/hocs/PageTransititions/FadeInOut";

import Form from "~/app/_components/form";
import { Suspense } from "react";

export default async function Page() {
  const session = await getPageSession();
  if (session === null) return redirect("/");
  const trips = await api.trip.getSummariesByUser.query();
  return (
    <PageFadeInOut>
      <h1 className="z-10 text-xl">Dashboard</h1>
      <Suspense fallback={<FaSpinner />}>
        <p>User id: {session.user.userId}</p>
        <p>Username: {session.user.firstName}</p>
      </Suspense>
      <Form action="/api/auth/google/sign-out">
        <input type="submit" value="Sign out" />
      </Form>
      <div className="">
        <div className="fixed left-0 top-0 grid max-h-full w-full grid-cols-2 gap-16 overflow-y-scroll">
          <NewTrip />
          <Suspense fallback={<FaSpinner />}>
            {trips.map((trip) => (
              <TripCard key={nanoid()} trip={trip} />
            ))}
          </Suspense>
        </div>
      </div>
    </PageFadeInOut>
  );
}
