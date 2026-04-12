// ─── Types ────────────────────────────────────────────────────────────────────

type MergeFn = (...classes: string[]) => string;

/** A map of variant keys to their possible values and classes. */
type VariantMap = Record<string, Record<string, string>>;

/** Partial defaults for a given variant map. */
type DefaultsOf<V extends VariantMap> = Partial<{ [K in keyof V]: keyof V[K] }>;

/** A single negation condition. */
type Not<T> = { not: T };

/** Per-key condition in a compound rule: exact value or negation. */
type CompoundCondition<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K] | Not<keyof V[K]>;
};

/** A compound variant rule: conditions + the class to apply when they match. */
type CompoundRule<V extends VariantMap> = CompoundCondition<V> & { class: string };

/**
 * Infer call-site props from a variant map and its defaults.
 * - Variants with a default → optional
 * - Variants without a default → required
 */
type InferProps<V extends VariantMap, D extends DefaultsOf<V>> = {
  [K in keyof V as K extends keyof D ? never : K]: keyof V[K];
} & { [K in keyof V as K extends keyof D ? K : never]?: keyof V[K] } & {
  class?: string;
  className?: string;
};

/** A callable builder that also exposes `.variants()`, `.defaults()`, `.compound()`. */
interface StyraBuilder<V extends VariantMap, D extends DefaultsOf<V>> {
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

// ─── Implementation ───────────────────────────────────────────────────────────

function matchesCompound<V extends VariantMap>(
  rule: CompoundRule<V>,
  resolved: Record<string, unknown>,
): boolean {
  for (const key in rule) {
    if (key === "class") continue;
    const condition = (rule as Record<string, unknown>)[key];
    const value = resolved[key];
    if (condition !== null && typeof condition === "object" && "not" in condition) {
      if (value === (condition as Not<unknown>).not) return false;
    } else {
      if (value !== condition) return false;
    }
  }
  return true;
}

type Resolver = { key: string; map: Record<string, string>; def: string | undefined };

function makeBuilder<V extends VariantMap, D extends DefaultsOf<V>>(
  base: string,
  variantMap: V,
  defaultMap: D,
  compoundRules: Array<CompoundRule<V>>,
  customMerge: MergeFn | undefined,
  variantsLocked: boolean,
): StyraBuilder<V, D> {
  // Flatten variant lookup at build time: one array, no double property access per call
  const defaultMapRaw = defaultMap as Record<string, string | undefined>;
  const resolvers: Resolver[] = Object.keys(variantMap).map((key) => ({
    key,
    map: variantMap[key] as Record<string, string>,
    def: defaultMapRaw[key],
  }));
  const hasCompound = compoundRules.length > 0;

  function call(props: Record<string, unknown>): string {
    if (customMerge) {
      // Custom merge path: collect into array so the merge fn sees individual classes
      const classes: string[] = [base];

      if (hasCompound) {
        const resolved: Record<string, unknown> = {};
        for (let i = 0; i < resolvers.length; i++) {
          const { key, map, def } = resolvers[i]!;
          const value = (props[key] ?? def) as string | undefined;
          resolved[key] = value;
          if (value !== undefined) {
            const cls = map[value];
            if (cls) classes.push(cls);
          }
        }
        for (let i = 0; i < compoundRules.length; i++) {
          if (matchesCompound(compoundRules[i]!, resolved)) classes.push(compoundRules[i]!.class);
        }
      } else {
        for (let i = 0; i < resolvers.length; i++) {
          const { key, map, def } = resolvers[i]!;
          const value = (props[key] ?? def) as string | undefined;
          if (value !== undefined) {
            const cls = map[value];
            if (cls) classes.push(cls);
          }
        }
      }

      const extra = props["class"];
      if (typeof extra === "string" && extra) classes.push(extra);
      const extraCn = props["className"];
      if (typeof extraCn === "string" && extraCn) classes.push(extraCn);

      return customMerge(...classes);
    }

    // Default path: build string inline, zero extra allocations
    let result = base;

    if (hasCompound) {
      const resolved: Record<string, unknown> = {};
      for (let i = 0; i < resolvers.length; i++) {
        const { key, map, def } = resolvers[i]!;
        const value = (props[key] ?? def) as string | undefined;
        resolved[key] = value;
        if (value !== undefined) {
          const cls = map[value];
          if (cls) result = result ? result + " " + cls : cls;
        }
      }
      for (let i = 0; i < compoundRules.length; i++) {
        if (matchesCompound(compoundRules[i]!, resolved)) {
          const cls = compoundRules[i]!.class;
          result = result ? result + " " + cls : cls;
        }
      }
    } else {
      for (let i = 0; i < resolvers.length; i++) {
        const { key, map, def } = resolvers[i]!;
        const value = (props[key] ?? def) as string | undefined;
        if (value !== undefined) {
          const cls = map[value];
          if (cls) result = result ? result + " " + cls : cls;
        }
      }
    }

    const extra = props["class"];
    if (typeof extra === "string" && extra) result = result ? result + " " + extra : extra;
    const extraCn = props["className"];
    if (typeof extraCn === "string" && extraCn) result = result ? result + " " + extraCn : extraCn;

    return result;
  }

  call.variants = function <NV extends VariantMap>(v: NV) {
    if (variantsLocked) {
      throw new Error("styra: .variants() can only be called once per builder");
    }
    return makeBuilder(base, v, {} as Record<never, never>, [], customMerge, true);
  };

  call.defaults = function <ND extends DefaultsOf<V>>(d: ND) {
    return makeBuilder(base, variantMap, d, compoundRules, customMerge, variantsLocked);
  };

  call.compound = function (rules: Array<CompoundRule<V>>) {
    return makeBuilder(base, variantMap, defaultMap, rules, customMerge, variantsLocked);
  };

  return call as unknown as StyraBuilder<V, D>;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface StyraOptions {
  /** Custom class merge function, e.g. `twMerge` from tailwind-merge. */
  merge?: MergeFn;
}

/**
 * Create a configured `styra` factory.
 *
 * @example
 * ```ts
 * import { createStyra } from 'styra'
 * import { twMerge } from 'tailwind-merge'
 *
 * export const { styra } = createStyra({ merge: twMerge })
 * ```
 */
export function createStyra(options?: StyraOptions) {
  const customMerge = options?.merge;

  function styra(base: string): StyraBuilder<Record<never, never>, Record<never, never>> {
    return makeBuilder(
      base,
      {} as Record<never, never>,
      {} as Record<never, never>,
      [],
      customMerge,
      false,
    );
  }

  return { styra };
}

/** Default `styra` instance with no custom merge function. */
export const { styra } = createStyra();

export type { StyraBuilder, VariantMap, CompoundRule, InferProps };
