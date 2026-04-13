import { createTvs, type VariantProps } from "@ntatoud/tvs";
import { twMerge } from "tailwind-merge";

export type { VariantProps };
export const { tvs, cn } = createTvs({ merge: twMerge });
