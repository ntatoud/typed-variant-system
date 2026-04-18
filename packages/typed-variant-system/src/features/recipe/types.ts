import type { RecipeMap, TvsBuilder } from "../core/types.js";

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

/** Forces TypeScript to evaluate a mapped/conditional type into a concrete object type. */
type Resolve<T> = { [K in keyof T]: T[K] };

/** Union the value tuples of two RecipeMaps, merging conflicting keys by concatenating their value arrays. */
type MergedRecipeMap<A extends RecipeMap, B extends RecipeMap> = Resolve<{
  [K in keyof A | keyof B]: K extends keyof A & keyof B
    ? readonly [...A[K], ...B[K]]
    : K extends keyof A
      ? A[K]
      : K extends keyof B
        ? B[K]
        : never;
}>;

/**
 * A reusable, composable variant schema that can be extended with other shapes.
 *
 * Recipes are callable — `sizeVariants("base")` is shorthand for `tvs("base", sizeVariants)`
 * and returns a constrained builder directly.
 *
 * @example
 * ```ts
 * const input = sizeVariants("input rounded-xl border")
 *   .variants({ size: { sm: "h-7", default: "h-9", lg: "h-11" } })
 *   .defaults({ size: "default" });
 *
 * // Compose first, then call:
 * const button = sizeVariants.and(intentShape)("btn font-medium")
 *   .variants({ size: { ... }, intent: { ... } });
 * ```
 */
export interface Recipe<S extends RecipeMap> {
  /** Create a constrained builder — shorthand for `tvs(base, thisRecipe)`. */
  (base: string): TvsBuilder<Record<never, never>, Record<never, never>, S>;

  /** The raw shape map. */
  readonly _recipe: S;

  /** Strict compose — type error if recipes share any keys. Accepts a Recipe or a plain shape object. */
  and<S2 extends RecipeMap>(other: Recipe<NoConflict<S, S2>> | NoConflict<S, S2>): Recipe<S & S2>;

  /** Soft compose — union values for conflicting keys, no error. Accepts a Recipe or a plain shape object. */
  merge<S2 extends RecipeMap>(other: Recipe<S2> | S2): Recipe<MergedRecipeMap<S, S2>>;

  /** Add extra variant keys to this recipe's shape. */
  variants<S2 extends RecipeMap>(extra: S2): Recipe<S & S2>;

  /** Stamp this shape into a builder by providing class mappings. */
  implement(
    classes: VariantMapOf<S> & { base?: string },
  ): TvsBuilder<VariantMapOf<S>, Record<never, never>>;
}
