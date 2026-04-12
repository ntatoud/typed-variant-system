import { clsx, type ClassValue } from "clsx";
import { createStyra, type VariantProps } from "styra";
import { twMerge } from "tailwind-merge";

export type { VariantProps };
export const { styra } = createStyra({ merge: twMerge });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
