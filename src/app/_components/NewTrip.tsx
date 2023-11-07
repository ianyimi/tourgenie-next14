"use client";

import { useRouter } from "next/navigation";
import { observer, useObservable } from "@legendapp/state/react";
import { api } from "~/trpc/react";
import { cnMerge } from "~/styles/utils";

const NewTrip = observer(() => {
  const newTripButton$ = useObservable({ hover: false });
  const router = useRouter();
  const createTripMutator = api.trip.create.useMutation();
  const utils = api.useUtils();

  async function handleCreateNewTrip() {
    await createTripMutator.mutateAsync().then(
      async () => {
        await utils.trip.getSummariesByUser.invalidate();
        console.log("Successfully created new trip");
        return { success: true };
      },
      () => {
        console.error("Failed to create new trip");
        return { message: "Failed to create new trip" };
      },
    );
    // router.push(`/plan/${newTrip.newTripId}`);
  }
  return (
    <div>
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      {/* <div className="mx-auto min-w-full pt-10 border-2 "> */}
      {/* Content goes here */}
      <div className="h-80 w-80 rounded-xl text-center">
        <button
          type="button"
          onClick={handleCreateNewTrip}
          onMouseOver={() => newTripButton$.hover.set(true)}
          onMouseLeave={() => newTripButton$.hover.set(false)}
          className="relative block h-full w-full rounded-lg border-2 border-dashed border-tgSecondary bg-tgBackgroundDark/50 p-12 text-center transition-colors hover:border-tgPrimary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg
            className={cnMerge(
              "mx-auto h-12 w-12 text-inherit transition-colors",
              newTripButton$.hover.get() && "text-tgPrimary",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3
            className={cnMerge(
              "dark:tgBackgroundDark mt-2 text-sm font-semibold text-tgBackgroundLight transition-colors",
            )}
          >
            New Trip
          </h3>
        </button>
      </div>
    </div>
  );
});

export default NewTrip;
