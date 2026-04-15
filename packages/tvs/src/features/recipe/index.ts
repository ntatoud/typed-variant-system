import { makeBuilder } from "../core/index.js";
import type { TvsBuilder, VariantMap } from "../core/types.js";

import type { Recipe, RecipeMap, VariantMapOf } from "./types.js";

export type { Recipe, RecipeClasses } from "./types.js";

/**
 * Create a reusable shape — a pure variant schema (no class names) that can be
 * extended with other shapes and turned into a builder via `.implement(classes)`.
 */
export function createRecipe<const S extends RecipeMap>(shape: S): Recipe<S> {
  return {
    _recipe: shape,
    extend<S2 extends RecipeMap>(other: Recipe<S2>): Recipe<Omit<S, keyof S2> & S2> {
      return createRecipe({ ...shape, ...other._recipe } as Omit<S, keyof S2> & S2);
    },
    implement(classes: VariantMapOf<S>) {
      return makeBuilder(
        "",
        classes as unknown as VariantMap,
        {} as Record<never, never>,
        [],
        undefined,
        true,
      ) as unknown as TvsBuilder<VariantMapOf<S>, Record<never, never>>;
    },
  };
}
