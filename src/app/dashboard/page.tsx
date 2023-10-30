// app/login/page.tsx
import { getPageSession } from "~/server/auth/lucia";
import { redirect } from "next/navigation";

import Form from "~/app/_components/form";

const Page = async () => {
  const session = await getPageSession();
  if (!session) redirect("/");
  return (
    <>
      <h1 className="z-10 text-xl">Dashboard</h1>
      <p>User id: {session.user.userId}</p>
      <p>Username: {session.user.firstName}</p>
      <Form action="/api/auth/google/sign-out">
        <input type="submit" value="Sign out" />
      </Form>
    </>
  );
};

export default Page;
