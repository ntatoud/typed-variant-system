export type MergeFn = (...classes: string[]) => string;

/** A map of variant keys to their possible values and classes. */
export type VariantMap = Record<string, Record<string, string>>;

/** Partial defaults for a given variant map. */
export type DefaultsOf<V extends VariantMap> = Partial<{ [K in keyof V]: keyof V[K] }>;

/** A single negation condition. */
export type Not<T> = { not: T };

/** Per-key condition in a compound rule: exact value or negation. */
export type CompoundCondition<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K] | Not<keyof V[K]>;
};

/** A compound variant rule: conditions + the class to apply when they match. */
export type CompoundRule<V extends VariantMap> = CompoundCondition<V> & { class: string };

/**
 * Infer call-site props from a variant map and its defaults.
 * - Variants with a default → optional
 * - Variants without a default → required
 */
export type InferProps<V extends VariantMap, D extends DefaultsOf<V>> = {
  [K in keyof V as K extends keyof D ? never : K]: keyof V[K];
} & { [K in keyof V as K extends keyof D ? K : never]?: keyof V[K] } & {
  class?: string;
  className?: string;
};

/** A callable builder that also exposes `.variants()`, `.defaults()`, `.compound()`. */
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
