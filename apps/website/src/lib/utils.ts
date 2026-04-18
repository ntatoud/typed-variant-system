import { createTvs, recipe, type VariantProps } from "typed-variant-system";
import { twMerge } from "tailwind-merge";

export type { VariantProps };
export const { tvs, cn } = createTvs({ merge: twMerge });

/** Shared variant shape for components that expose the standard intent scale. */
export const intentVariants = recipe({
  variant: ["default", "secondary", "destructive", "outline", "ghost", "link"] as const,
});

/** Shared size shape for form elements and components that expose the standard size scale. */
export const sizeVariants = recipe({
  size: ["sm", "default", "lg"] as const,
});
