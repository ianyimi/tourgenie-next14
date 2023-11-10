import Link from "next/link";

import { auth } from "~/server/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { type UserAuthSession } from "app";
import Form from "~/app/_components/form";
import Landing from "~/app/_components/Landing";
import PageFadeInOut from "../_components/hocs/PageTransititions/FadeInOut";

export default async function Home() {
  const hello = "hello";
  const authRequest = auth.handleRequest("GET", context);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const session: UserAuthSession = await authRequest.validate();

  return (
    <main className="z-10">
      <PageFadeInOut>
        <Landing />
      </PageFadeInOut>
    </main>
  );
}

function CrudShowcase() {
  const latestPost = "test";

  return (
    <div className="w-full max-w-xs">
      {latestPost}
      {/* <CreatePost /> */}
    </div>
  );
}
