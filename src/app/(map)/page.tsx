import Link from "next/link";

import { auth } from "~/server/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { type UserAuthSession } from "app";
import Form from "~/app/_components/form";
import Landing from "~/app/_components/Landing";

export default async function Home() {
  const hello = "hello";
  const authRequest = auth.handleRequest("GET", context);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const session: UserAuthSession = await authRequest.validate();
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">{hello}</p>
          </div>
          <form action="/api/auth/google" method="GET">
            <button type="submit">Sign In w Google</button>
          </form>

          <CrudShowcase />
        </div>
      </main>
    );
  }

  return (
    <main className="z-10">
      <Landing />
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
