import Link from "next/link";
import { useRouter } from "next/router";
// import { observer, useObservable } from "@legendapp/state/react";
import { api } from "~/trpc/react";
import { type DestinationSummary } from "~/state/trip";
import { cnMerge } from "~/styles/utils";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "~/app/_components/ui/card";

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
    <div>
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      {/* <div className="mx-auto min-w-full pt-10 border-2 "> */}
      {/* Content goes here */}
      {/* <div className="grid h-80 w-80 place-items-center rounded-xl text-center"> */}
      <Link
        href={`/plan/${trip.id}`}
        // className="relative block h-full w-full rounded-lg border-2 border-dashed border-tgSecondary bg-tgBackgroundDark/50 p-12 text-center transition-colors hover:border-tgPrimary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <Card className="rounded- h-[4.5in] w-[3.5in] bg-tgBackgroundDark/50 p-8 text-white shadow-md dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{trip.name}</CardTitle>
            <CardDescription className="text-xs">{trip.id}</CardDescription>
          </CardHeader>
          <CardContent className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="">Destination:</span>
              <span className="">{trip.summary?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="">Start Date:</span>
              <span className="">{trip.departureDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="">End Date:</span>
              <span className="">{trip.returnDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="">Duration:</span>
              <span className="">{trip.duration}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
      {/* </div> */}
    </div>
  );
};

export default TripCard;
