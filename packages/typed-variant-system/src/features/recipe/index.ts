import { tvs } from "../core/index.js";

import type { Recipe, RecipeMap } from "./types.js";

export type { Recipe, RecipeClasses, RecipeMap, VariantMapOf } from "./types.js";

function makeRecipe<S extends RecipeMap>(shape: S): Recipe<S> {
  function call(base: string) {
    return tvs(base, { _recipe: shape } as Recipe<S>);
  }

  call._recipe = shape;

  call.and = function (other: Recipe<RecipeMap> | RecipeMap) {
    const otherShape = typeof other === "function" ? other._recipe : other;
    return makeRecipe({ ...shape, ...otherShape } as unknown as RecipeMap) as never;
  };

  call.merge = function (other: Recipe<RecipeMap> | RecipeMap) {
    const otherShape = typeof other === "function" ? other._recipe : other;
    const merged: Record<string, readonly string[]> = { ...shape };
    for (const key of Object.keys(otherShape)) {
      if (key in merged) {
        merged[key] = [...merged[key]!, ...otherShape[key]!];
      } else {
        merged[key] = otherShape[key]!;
      }
    }
    return makeRecipe(merged as unknown as RecipeMap) as never;
  };

  call.variants = function (extra: RecipeMap) {
    return makeRecipe({ ...shape, ...extra } as unknown as RecipeMap) as never;
  };

  return call as unknown as Recipe<S>;
}

/**
 * Create a reusable variant shape — a pure schema (no class names) that can be
 * composed with other shapes and passed to `tvs()` as a type constraint.
 *
 * @example
 * ```ts
 * const sizeVariants = recipe({ size: ["sm", "md", "lg"] });
 * const colorShape = recipe({ color: ["red", "blue"] });
 *
 * const buttonVariants = tvs("btn", sizeVariants, colorShape)
 *   .variants({
 *     size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
 *     color: { red: "bg-red", blue: "bg-blue" },
 *   });
 * ```
 */
export function recipe<const S extends RecipeMap>(shape: S): Recipe<S> {
  return makeRecipe(shape);
}
