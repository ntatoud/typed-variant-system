export type MergeFn = (...classes: string[]) => string;

/** Merge two variant value types: union of parent and override keys, all string values. */
type MergeVariantValues<P, O> =
  P extends Record<string, string>
    ? O extends Record<string, string>
      ? { [K in keyof P | keyof O]: string }
      : P
    : O;

/** Resulting variant map when extending V with OV: parent keys merged, new keys added. */
export type MergedVariantMap<V extends VariantMap, OV extends VariantMap> = Omit<V, keyof OV> & {
  [K in keyof OV]: K extends keyof V ? MergeVariantValues<V[K], OV[K]> : OV[K];
};

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
export type Not<T> = { not: T };

/** Per-key condition in a compound rule: exact value or negation. */
export type CompoundCondition<V extends VariantMap> = {
  [K in keyof V]?: PropTypeOf<V[K]> | Not<PropTypeOf<V[K]>>;
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
  class?: string;
  className?: string;
};

/** A callable builder that also exposes `.variants()`, `.defaults()`, `.compound()`, `.extend()`. */
export interface StyraBuilder<V extends VariantMap, D extends DefaultsOf<V>> {
  (
    props: keyof V extends never ? { class?: string; className?: string } : InferProps<V, D>,
  ): string;
  /**
   * Define variant keys and their class mappings.
   * Can only be called once — throws at runtime if called again.
   */
  variants<NV extends VariantMap>(v: NV): StyraBuilder<NV, Record<never, never>>;
  /** Set default values for variants, making them optional at call-site. */
  defaults<ND extends DefaultsOf<V>>(d: ND): StyraBuilder<V, ND>;
  /** Add compound variant rules applied when multiple variant conditions are met. */
  compound(rules: Array<CompoundRule<V>>): StyraBuilder<V, D>;
  /**
   * Create a new builder that inherits all variants, defaults, and compound rules from this
   * builder, with the given overrides merged on top.
   *
   * @example
   * ```ts
   * const inputGroupButtonVariants = buttonVariants.extend({
   *   size: { xs: "h-6 px-2 text-xs", sm: "h-7 px-2.5 text-sm" },
   * });
   * ```
   */
  extend<OV extends VariantMap>(
    overrides: OV,
  ): StyraBuilder<
    MergedVariantMap<V, OV>,
    D extends DefaultsOf<MergedVariantMap<V, OV>> ? D : Record<never, never>
  >;
}

/** Custom class merge function, e.g. `twMerge` from tailwind-merge. */
export interface StyraOptions {
  merge?: MergeFn;
}

/**
 * Extract the variant props from a `StyraBuilder`, stripping `class` and `className`.
 *
 * @example
 * ```ts
 * const buttonVariants = styra("btn").variants({ size: { sm: "...", md: "..." } });
 * type ButtonVariantProps = VariantProps<typeof buttonVariants>;
 * // → { size: "sm" | "md" }
 * ```
 */
export type VariantProps<T extends (...args: never[]) => string> = Omit<
  Parameters<T>[0],
  "class" | "className"
>;
