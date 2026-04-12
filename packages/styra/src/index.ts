import type {
  CompoundRule,
  DefaultsOf,
  MergeFn,
  Not,
  StyraBuilder,
  StyraOptions,
  VariantMap,
} from "./types.js";

function matchesCompound<V extends VariantMap>(
  rule: CompoundRule<V>,
  resolved: Record<string, unknown>,
): boolean {
  for (const key in rule) {
    if (key === "class") continue;
    const rawCondition = (rule as Record<string, unknown>)[key];
    const value = resolved[key];
    if (rawCondition !== null && typeof rawCondition === "object" && "not" in rawCondition) {
      const notVal =
        toKey((rawCondition as Not<unknown>).not) ?? (rawCondition as Not<unknown>).not;
      if (value === notVal) return false;
    } else {
      const condition = toKey(rawCondition) ?? rawCondition;
      if (value !== condition) return false;
    }
  }
  return true;
}

type Resolver = { key: string; map: Record<string, string>; def: string | undefined };

/** Coerce a prop value to its string key for map lookup (handles booleans from boolean shorthand). */
function toKey(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (v === true) return "true";
  if (v === false) return "false";
  return v as string;
}

function makeBuilder<V extends VariantMap, D extends DefaultsOf<V>>(
  base: string,
  variantMap: V,
  defaultMap: D,
  compoundRules: Array<CompoundRule<V>>,
  customMerge: MergeFn | undefined,
  variantsLocked: boolean,
): StyraBuilder<V, D> {
  // Flatten variant lookup at build time: one array, no double property access per call
  const defaultMapRaw = defaultMap as Record<string, unknown>;
  const resolvers: Resolver[] = Object.keys(variantMap).map((key) => {
    const raw = variantMap[key];
    // Boolean shorthand: a plain string becomes { true: string, false: "" }
    const map: Record<string, string> =
      typeof raw === "string" ? { true: raw, false: "" } : (raw as Record<string, string>);
    const def = defaultMapRaw[key];
    // Coerce boolean defaults to their string key equivalents for map lookup
    const defStr = def === true ? "true" : def === false ? "false" : (def as string | undefined);
    return { key, map, def: defStr };
  });
  const hasCompound = compoundRules.length > 0;

  function call(props: Record<string, unknown>): string {
    if (customMerge) {
      // Custom merge path: collect into array so the merge fn sees individual classes
      const classes: string[] = [base];

      if (hasCompound) {
        const resolved: Record<string, unknown> = {};
        for (let i = 0; i < resolvers.length; i++) {
          const { key, map, def } = resolvers[i]!;
          const value = toKey(props[key]) ?? def;
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
          const value = toKey(props[key]) ?? def;
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
        const value = toKey(props[key]) ?? def;
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
        const value = toKey(props[key]) ?? def;
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

  call.extend = function <OV extends VariantMap>(overrides: OV) {
    const mergedVariants = { ...variantMap, ...overrides } as VariantMap;
    // Drop defaults for overridden keys so they don't carry stale values
    const mergedDefaults: Record<string, unknown> = {};
    for (const key in defaultMap as Record<string, unknown>) {
      if (!(key in overrides)) mergedDefaults[key] = (defaultMap as Record<string, unknown>)[key];
    }
    return makeBuilder(
      base,
      mergedVariants,
      mergedDefaults as DefaultsOf<VariantMap>,
      compoundRules as Array<CompoundRule<VariantMap>>,
      customMerge,
      true,
    );
  };

  return call as unknown as StyraBuilder<V, D>;
}

export type {
  StyraBuilder,
  StyraOptions,
  VariantMap,
  CompoundRule,
  InferProps,
  VariantProps,
} from "./types.js";

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
