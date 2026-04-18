import { makeBuilder } from "../internal-core/index.js";
import { matchesCompound } from "../core/index.js";
import type { VariantMap } from "../core/types.js";

import type { Recipe, RecipeMap, VariantMapOf } from "./types.js";

export type { Recipe, RecipeClasses, RecipeMap, VariantMapOf } from "./types.js";

function makeRecipe<S extends RecipeMap>(shape: S): Recipe<S> {
  return {
    _recipe: shape,

    and(other) {
      return makeRecipe({ ...shape, ...other._recipe } as unknown as RecipeMap) as never;
    },

    merge(other) {
      const merged: Record<string, readonly string[]> = { ...shape };
      for (const key in other._recipe) {
        if (key in merged) {
          merged[key] = [...merged[key]!, ...other._recipe[key]!];
        } else {
          merged[key] = other._recipe[key]!;
        }
      }
      return makeRecipe(merged as unknown as RecipeMap) as never;
    },

    variants(extra) {
      return makeRecipe({ ...shape, ...extra } as unknown as RecipeMap) as never;
    },

    implement(classes) {
      const { base = "", ...variantClasses } = classes as { base?: string } & VariantMapOf<S>;
      return makeBuilder(
        base,
        variantClasses as unknown as VariantMap,
        {} as Record<never, never>,
        [],
        undefined,
        true,
        matchesCompound,
      ) as never;
    },
  };
}

/**
 * Create a reusable variant shape — a pure schema (no class names) that can be
 * composed with other shapes and passed to `tvs()` as a type constraint.
 *
 * @example
 * ```ts
 * const sizeShape = recipe({ size: ["sm", "md", "lg"] });
 * const colorShape = recipe({ color: ["red", "blue"] });
 *
 * const buttonVariants = tvs("btn", sizeShape, colorShape)
 *   .variants({
 *     size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
 *     color: { red: "bg-red", blue: "bg-blue" },
 *   });
 * ```
 */
export function recipe<const S extends RecipeMap>(shape: S): Recipe<S> {
  return makeRecipe(shape);
}
