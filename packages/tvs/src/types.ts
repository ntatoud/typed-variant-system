export type MergeFn = (...classes: string[]) => string;

/** A clsx-compatible class value: string, number, boolean, null, undefined, array, object map, or render-prop function. */
export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, unknown>
  | ((...args: never[]) => ClassValue);

/**
 * A map of variant keys to their possible values and classes.
 * Values can be a `Record<string, string>` (explicit map) or a plain `string`
 * (boolean shorthand — applied when the prop is `true`, skipped when `false`/`undefined`).
 */
export type VariantMap = Record<string, Record<string, string> | string>;

/** Resolve the call-site prop type for a single variant value definition. */
type PropTypeOf<V> = V extends string ? boolean : keyof V;

/** Partial defaults for a given variant map. */
export type DefaultsOf<V extends VariantMap> = Partial<{ [K in keyof V]: PropTypeOf<V[K]> }>;

/** A single negation condition. */
export type Not<T> = { not: T | T[] };

/** Per-key condition in a compound rule: exact value, array of values (OR), negation, or negated array. */
export type CompoundCondition<V extends VariantMap> = {
  [K in keyof V]?: PropTypeOf<V[K]> | PropTypeOf<V[K]>[] | Not<PropTypeOf<V[K]>>;
};

/** A compound variant rule: conditions + the class to apply when they match. */
export type CompoundRule<V extends VariantMap> = CompoundCondition<V> & { class: string };

/**
 * Infer call-site props from a variant map and its defaults.
 * - Variants with a default → optional
 * - Variants without a default → required
 */
export type InferProps<V extends VariantMap, D extends DefaultsOf<V>> = {
  [K in keyof V as K extends keyof D ? never : K]: PropTypeOf<V[K]>;
} & { [K in keyof V as K extends keyof D ? K : never]?: PropTypeOf<V[K]> } & {
  class?: ClassValue;
  className?: ClassValue | ((...args: never[]) => ClassValue);
};

/** A callable builder that also exposes `.variants()`, `.defaults()`, `.compound()`. */
export interface TvsBuilder<V extends VariantMap, D extends DefaultsOf<V>> {
  (
    props: keyof V extends never
      ? { class?: ClassValue; className?: ClassValue | ((...args: never[]) => ClassValue) }
      : InferProps<V, D>,
  ): string;
  /**
   * Define variant keys and their class mappings.
   * Can only be called once — throws at runtime if called again.
   */
  variants<NV extends VariantMap>(v: NV): TvsBuilder<NV, Record<never, never>>;
  /** Set default values for variants, making them optional at call-site. */
  defaults<ND extends DefaultsOf<V>>(d: ND): TvsBuilder<V, ND>;
  /** Add compound variant rules applied when multiple variant conditions are met. */
  compound(rules: Array<CompoundRule<V>>): TvsBuilder<V, D>;
}

/** Custom class merge function, e.g. `twMerge` from tailwind-merge. */
export interface TvsOptions {
  merge?: MergeFn;
}

/**
 * A pure variant schema: maps variant keys to their possible string values.
 * No class names — those are provided when stamping a builder with `.from()`.
 */
type RecipeMap = Record<string, readonly string[]>;

/** Derive a `VariantMap` from a `RecipeMap` (each key → `Record<value, string>`). */
type VariantMapOf<S extends RecipeMap> = {
  [K in keyof S]: Record<S[K][number], string>;
};

/**
 * Extract the class mappings type from a `Shape` instance.
 * Useful for annotating shared class objects before passing to `.implement()` or `.from()`.
 *
 * @example
 * ```ts
 * const buttonRecipe = sizeRecipe.extend(intentRecipe);
 * const sharedClasses: RecipeClasses<typeof buttonRecipe> = { ... };
 * ```
 */
export type RecipeClasses<T> = T extends Recipe<infer S> ? VariantMapOf<S> : never;

/**
 * A reusable, composable variant schema that can be extended with other shapes
 * and stamped onto any `tvs` builder via `.from(shape, classes)`.
 */
export interface Recipe<S extends RecipeMap> {
  /** The raw shape map. */
  readonly _recipe: S;
  /** Merge this shape with another, combining their variant keys. Later shape wins on conflicts. */
  extend<S2 extends RecipeMap>(other: Recipe<S2>): Recipe<Omit<S, keyof S2> & S2>;
  /** Create a builder directly from this shape by providing the class mappings. */
  implement(classes: VariantMapOf<S>): TvsBuilder<VariantMapOf<S>, Record<never, never>>;
}

/**
 * Extract the variant props from a `TvsBuilder`, stripping `class` and `className`.
 *
 * @example
 * ```ts
 * const buttonVariants = tvs("btn").variants({ size: { sm: "...", md: "..." } });
 * type ButtonVariantProps = VariantProps<typeof buttonVariants>;
 * // → { size: "sm" | "md" }
 * ```
 */
export type VariantProps<T extends (...args: never[]) => string> = Omit<
  Parameters<T>[0],
  "class" | "className"
>;
