"use client";

import { type HTMLAttributes } from "react";
import { cnMerge } from "~/styles/utils";

type RoundIconButtonProps = {
  value: string;
  children: React.ReactNode;
} & HTMLAttributes<HTMLButtonElement>;

export default function RoundIconButton({
  value,
  children,
  className,
  ...restProps
}: RoundIconButtonProps) {
  return (
    <button
      type="button"
      value={value}
      className={cnMerge(
        "rounded-full bg-tgSecondary p-2 text-tgBackgroundDark shadow-sm transition-colors hover:bg-tgPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tgBackgroundDark dark:bg-tgPrimary dark:text-tgBackgroundLight dark:hover:bg-tgAccent dark:focus-visible:outline-tgBackgroundLight",
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}
