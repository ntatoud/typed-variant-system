import { createStyra, type VariantProps } from "@ntatoud/styra";
import { twMerge } from "tailwind-merge";

export type { VariantProps };
export const { styra, cn } = createStyra({ merge: twMerge });
