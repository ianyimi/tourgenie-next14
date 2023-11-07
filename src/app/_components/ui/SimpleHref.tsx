"use client";

import Link from "next/link";

export default function SimpleHref({
  href,
  hideNav = false,
  children,
}: {
  href: string;
  hideNav?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      // onClick={() => hideNav && setNavStatus(false)}
      href={{ pathname: href }}
      className="rounded-md bg-tgSecondary dark:bg-tgPrimary dark:hover:bg-tgSecondary px-3.5 py-2.5 text-sm font-semibold shadow-sm transition-colors duration-500 hover:bg-tgPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tgSecondary"
    >
      {children}
    </Link>
  );
}
