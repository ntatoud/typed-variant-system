import { makeBuilder } from "../internal-core/index.js";
import { matchesCompound, tvs } from "../core/index.js";
import type { VariantMap } from "../core/types.js";

import type { Recipe, RecipeMap, VariantMapOf } from "./types.js";

export type { Recipe, RecipeClasses, RecipeMap, VariantMapOf } from "./types.js";

function makeRecipe<S extends RecipeMap>(shape: S): Recipe<S> {
  function call(base: string) {
    return tvs(base, { _recipe: shape } as Recipe<S>);
  }

  call._recipe = shape;

  call.and = function (other: Recipe<RecipeMap>) {
    return makeRecipe({ ...shape, ...other._recipe } as unknown as RecipeMap) as never;
  };

  call.merge = function (other: Recipe<RecipeMap>) {
    const merged: Record<string, readonly string[]> = { ...shape };
    for (const key in other._recipe) {
      if (key in merged) {
        merged[key] = [...merged[key]!, ...other._recipe[key]!];
      } else {
        merged[key] = other._recipe[key]!;
      }
    }
    return makeRecipe(merged as unknown as RecipeMap) as never;
  };

  call.variants = function (extra: RecipeMap) {
    return makeRecipe({ ...shape, ...extra } as unknown as RecipeMap) as never;
  };

  call.implement = function (classes: VariantMapOf<S> & { base?: string }) {
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
  };

  return call as unknown as Recipe<S>;
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
