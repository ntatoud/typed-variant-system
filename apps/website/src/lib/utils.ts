import { clsx, type ClassValue } from "clsx";
import { createStyra } from "styra";
import { twMerge } from "tailwind-merge";

export const { styra } = createStyra({ merge: twMerge });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
