"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Dialog } from "@headlessui/react";
import {
  observer,
  useIsMounted,
  useMount,
  useMountOnce,
  useObservable,
} from "@legendapp/state/react";
import Favicon from "~/assets/icon3.png";
import { LogoIcon } from "~/assets/icons";
import { SpaceGrotesk } from "~/styles/fonts";
import { cnJoin, cnMerge } from "~/styles/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { nanoid } from "nanoid";

import { Button } from "./ui/button";
import ThemeToggle from "./ui/ThemeToggle";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Company", href: "#" },
];

const Nav = observer(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();

  const scrollState$ = useObservable({
    previousScrollY: 0,
    isNavVisible: true,
  });

  const options = { passive: true };
  function handleScroll() {
    console.log("scroll");
    if (window.scrollY > scrollState$.previousScrollY.get()) {
      scrollState$.isNavVisible.set(false);
    } else {
      scrollState$.isNavVisible.set(true);
    }
    scrollState$.previousScrollY.set(window.scrollY);
  }

  // useEffect only runs on the client, so now we can safely show the UI
  useMount(() => {
    document.addEventListener("scroll", handleScroll, options);
    return () => document.removeEventListener("scroll", handleScroll);
  });

  if (!useIsMounted().get()) {
    return null;
  }

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   console.log("Page scroll: ", latest);
  // });

  return (
    <div>
      <motion.div
        key={nanoid()}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        initial="hidden"
        animate={pathname === "/" ? "visible" : "hidden"}
        // style={{ scaleY: scrollYProgress.get() < 0.25 ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={cnMerge(
          "absolute z-10 min-w-full",
          scrollState$.isNavVisible.get() && "top-0",
          SpaceGrotesk.className,
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between bg-tgBackgroundLight p-4 text-tgBackgroundDark dark:bg-tgBackgroundDark dark:text-tgBackgroundLight lg:px-8"
          aria-label="Global"
        >
          <div className="flex flex-1">
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-base font-semibold leading-6 transition-colors duration-500 hover:text-tgPrimary"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">TourGenie</span>
            {/* <Image className="h-8 w-auto" src={Favicon} alt="tourgenie-logo" /> */}
            <LogoIcon className="h-20 w-20" />
          </a>
          <div className="flex flex-1 justify-end">
            <form action="/api/auth/google">
              <button
                type="submit"
                className="text-sm font-semibold leading-6 transition-colors duration-500 hover:text-tgPrimary"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
            <ThemeToggle />
          </div>
        </nav>
        <Dialog
          as="div"
          className={cnJoin(
            "bg-tgBackgroundLight text-tgBackgroundDark dark:bg-tgBackgroundDark dark:text-tgBackgroundLight lg:hidden",
            SpaceGrotesk.className,
          )}
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-inherit p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-1">
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">TourGenie</span>
                <LogoIcon className="h-8 w-auto" />
              </Link>
              <form
                className="flex flex-1 justify-end"
                action="/api/auth/google"
              >
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-sm font-semibold leading-6 hover:text-tgPrimary"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </Button>
              </form>
            </div>
            <div className="mt-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors hover:bg-tgBackgroundLight hover:text-tgBackgroundDark"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Dialog.Panel>
        </Dialog>
      </motion.div>
    </div>
  );
});

export default Nav;
