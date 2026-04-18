import { type VariantProps } from "typed-variant-system";
import { createTvs } from "typed-variant-system/config";
import { recipe } from "typed-variant-system/recipe";
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

/** Combined intent + size shape for components that expose both scales (e.g. Button). */
export const intentAndSizeVariants = intentVariants.and(sizeVariants);
