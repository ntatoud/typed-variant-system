import { createTvs, type VariantProps } from "typed-variant-system";
import { twMerge } from "tailwind-merge";

export type { VariantProps };
export const { tvs, cn } = createTvs({ merge: twMerge });
