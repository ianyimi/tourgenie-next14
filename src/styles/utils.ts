import clsx, { type ClassValue } from "clsx";
import { twJoin, twMerge } from "tailwind-merge";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfigOptions from "../../tailwind.config";

export const tailwindConfig = resolveConfig(tailwindConfigOptions);

export function cnMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cnJoin(...inputs: ClassValue[]) {
  return twJoin(clsx(inputs));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
