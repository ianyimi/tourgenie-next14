"use client";

import { useTheme } from "next-themes";
import { LuMoon, LuSun, LuSunMoon } from "react-icons/lu";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className="ml-4 cursor-pointer px-2 transition-colors duration-500 hover:text-tgPrimary xl:ml-24"
      onClick={() => {
        if (theme === "system") {
          setTheme("light");
        } else if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("system");
        }
      }}
    >
      {theme === "system" ? (
        <LuSunMoon />
      ) : theme === "dark" ? (
        <LuMoon />
      ) : (
        <LuSun />
      )}
    </div>
  );
}
