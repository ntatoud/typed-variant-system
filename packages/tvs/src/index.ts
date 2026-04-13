import type {
  ClassValue,
  CompoundRule,
  DefaultsOf,
  MergeFn,
  Not,
  TvsBuilder,
  TvsOptions,
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
      const notVal = (rawCondition as Not<unknown>).not;
      if (Array.isArray(notVal)) {
        for (let j = 0; j < notVal.length; j++) {
          if (value === (toKey(notVal[j]) ?? notVal[j])) return false;
        }
      } else {
        if (value === (toKey(notVal) ?? notVal)) return false;
      }
    } else if (Array.isArray(rawCondition)) {
      let matched = false;
      for (let j = 0; j < rawCondition.length; j++) {
        if (value === (toKey(rawCondition[j]) ?? rawCondition[j])) {
          matched = true;
          break;
        }
      }
      if (!matched) return false;
    } else {
      const condition = toKey(rawCondition) ?? rawCondition;
      if (value !== condition) return false;
    }
  }
  return true;
}

type Resolver = { key: string; map: Record<string, string>; def: string | undefined };

/** Recursively resolve a clsx-like value to a string. */
function toVal(mix: ClassValue): string {
  let str = "";
  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (Array.isArray(mix)) {
    for (let k = 0; k < mix.length; k++) {
      if (mix[k]) {
        const y = toVal(mix[k] as ClassValue);
        if (y) {
          if (str) str += " ";
          str += y;
        }
      }
    }
  } else if (mix !== null && typeof mix === "object") {
    for (const y in mix) {
      if ((mix as Record<string, unknown>)[y]) {
        if (str) str += " ";
        str += y;
      }
    }
  }
  return str;
}

/** Resolve a className prop that may be a clsx-like value or a render-prop function. */
function resolveClassName(v: unknown): string | undefined {
  if (typeof v === "function") return toVal((v as () => ClassValue)()) || undefined;
  const result = toVal(v as ClassValue);
  return result || undefined;
}

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
): TvsBuilder<V, D> {
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

      const extra = resolveClassName(props["class"]);
      if (extra) classes.push(extra);
      const extraCn = resolveClassName(props["className"]);
      if (extraCn) classes.push(extraCn);

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

    const extra = resolveClassName(props["class"]);
    if (extra) result = result ? result + " " + extra : extra;
    const extraCn = resolveClassName(props["className"]);
    if (extraCn) result = result ? result + " " + extraCn : extraCn;

    return result;
  }

  call.variants = function <NV extends VariantMap>(v: NV) {
    if (variantsLocked) {
      throw new Error("tvs: .variants() can only be called once per builder");
    }
    return makeBuilder(base, v, {} as Record<never, never>, [], customMerge, true);
  };

  call.defaults = function <ND extends DefaultsOf<V>>(d: ND) {
    return makeBuilder(base, variantMap, d, compoundRules, customMerge, variantsLocked);
  };

  call.compound = function (rules: Array<CompoundRule<V>>) {
    return makeBuilder(base, variantMap, defaultMap, rules, customMerge, variantsLocked);
  };

  return call as unknown as TvsBuilder<V, D>;
}

export type {
  ClassValue,
  TvsBuilder,
  TvsOptions,
  VariantMap,
  CompoundRule,
  InferProps,
  VariantProps,
} from "./types.js";

/**
 * Create a configured `tvs` factory.
 *
 * @example
 * ```ts
 * import { createTvs } from 'tvs'
 * import { twMerge } from 'tailwind-merge'
 *
 * export const { tvs, cn } = createTvs({ merge: twMerge })
 * ```
 */
export function createTvs(options?: TvsOptions) {
  const customMerge = options?.merge;

  function tvs(base: string): TvsBuilder<Record<never, never>, Record<never, never>> {
    return makeBuilder(
      base,
      {} as Record<never, never>,
      {} as Record<never, never>,
      [],
      customMerge,
      false,
    );
  }

  function cn(...args: ClassValue[]): string {
    let str = "";
    for (let i = 0; i < args.length; i++) {
      const val = toVal(args[i]);
      if (val) {
        if (str) str += " ";
        str += val;
      }
    }
    return customMerge ? customMerge(str) : str;
  }

  return { tvs, cn };
}

/** Default `tvs` instance with no custom merge function. */
export const { tvs, cn } = createTvs();
