import { createTvs, type VariantProps } from "tvs";
import { twMerge } from "tailwind-merge";

export type { VariantProps };
export const { tvs, cn } = createTvs({ merge: twMerge });
