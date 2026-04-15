import type { TvsBuilder } from "../core/types.js";

/**
 * A pure variant schema: maps variant keys to their possible string values.
 * No class names — those are provided when stamping a builder with `.implement()`.
 */
export type RecipeMap = Record<string, readonly string[]>;

/** Derive a variant class map from a recipe shape (each key → `Record<value, string>`). */
export type VariantMapOf<S extends RecipeMap> = {
  [K in keyof S]: Record<S[K][number], string>;
};

/**
 * Extract the class mappings type from a recipe instance.
 * Useful for annotating shared class objects before passing to `.implement()`.
 */
export type RecipeClasses<T> = T extends Recipe<infer S> ? VariantMapOf<S> : never;

/**
 * A reusable, composable variant schema that can be extended with other shapes
 * and stamped into a builder via `.implement(classes)`.
 */
export interface Recipe<S extends RecipeMap> {
  /** The raw shape map. */
  readonly _recipe: S;
  /** Merge this shape with another, combining their variant keys. Later shape wins on conflicts. */
  extend<S2 extends RecipeMap>(other: Recipe<S2>): Recipe<Omit<S, keyof S2> & S2>;
  /** Create a builder directly from this shape by providing class mappings. */
  implement(classes: VariantMapOf<S>): TvsBuilder<VariantMapOf<S>, Record<never, never>>;
}
