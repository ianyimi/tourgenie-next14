import Link from "next/link";
import { useRouter } from "next/router";
// import { observer, useObservable } from "@legendapp/state/react";
import { api } from "~/trpc/react";
import { type DestinationSummary } from "~/state/trip";
import { cnMerge } from "~/styles/utils";

// import { Button } from "./ui/button";

const TripCard = ({
  trip,
}: {
  trip: {
    id: string;
    userId: string;
    name: string | null;
    summary: DestinationSummary | null;
    departureDate: number | null;
    returnDate: number | null;
    duration: number | null;
  };
}) => {
  // const $tripCardState = useObservable({ hover: false });
  // const router = useRouter();

  // async function goToTripPlan() {
  //   return router.push(`/plan/${trip.id}`);
  // }
  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-20">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      {/* <div className="mx-auto min-w-full pt-10 border-2 "> */}
      {/* Content goes here */}
      <div className="grid h-80 w-80 place-items-center rounded-xl text-center">
        <Link
          href={`/plan/${trip.id}`}
          className="border-tgSecondary bg-tgBackgroundDark/50 hover:border-tgPrimary relative block h-full w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <p>{trip.id}</p>
          <p>{trip.userId}</p>
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
