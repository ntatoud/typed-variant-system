import type { TvsBuilder } from "../core/types.js";
import type { RecipeMap } from "../internal-core/index.js";

export type { RecipeMap };

/** Derive a variant class map from a recipe shape (each key → `Record<value, string>`). */
export type VariantMapOf<S extends RecipeMap> = {
  [K in keyof S]: Record<S[K][number], string>;
};

/**
 * Extract the class mappings type from a recipe instance.
 * Useful for annotating shared class objects before passing to `.implement()`.
 */
export type RecipeClasses<T> = T extends Recipe<infer S> ? VariantMapOf<S> : never;

/** Produces `never` when two RecipeMaps share conflicting keys, triggering a type error at call site. */
type NoConflict<A extends RecipeMap, B extends RecipeMap> = [keyof A & keyof B] extends [never]
  ? B
  : never;

/** Union the value tuples of two RecipeMaps, merging conflicting keys by concatenating their value arrays. */
type MergedRecipeMap<A extends RecipeMap, B extends RecipeMap> = {
  [K in keyof A | keyof B]: K extends keyof A & keyof B
    ? readonly [...A[K], ...B[K]]
    : K extends keyof A
      ? A[K]
      : K extends keyof B
        ? B[K]
        : never;
};

/**
 * A reusable, composable variant schema that can be extended with other shapes
 * and passed to `tvs()` as a type constraint.
 */
export interface Recipe<S extends RecipeMap> {
  /** The raw shape map. */
  readonly _recipe: S;

  /**
   * Strict merge — type error if recipes share any keys.
   * Use when combining two unrelated shapes that must not overlap.
   */
  and<S2 extends RecipeMap>(other: Recipe<NoConflict<S, S2>>): Recipe<S & S2>;

  /**
   * Soft merge — union values for conflicting keys, no error.
   * Use when two shapes share a key and you want all possible values.
   */
  merge<S2 extends RecipeMap>(other: Recipe<S2>): Recipe<MergedRecipeMap<S, S2>>;

  /**
   * Ad-hoc variant additions — extend this recipe's shape with extra keys.
   * Returns a new recipe with the combined shape.
   */
  variants<S2 extends RecipeMap>(extra: S2): Recipe<S & S2>;

  /**
   * Stamp this shape into a builder by providing class mappings.
   * @deprecated Prefer passing the recipe directly to `tvs()` instead.
   */
  implement(
    classes: VariantMapOf<S> & { base?: string },
  ): TvsBuilder<VariantMapOf<S>, Record<never, never>>;
}
