import { joinClassValues, makeBuilder } from "../internal-core/index.js";
import type { ClassValue, CompoundRule, Not, TvsBuilder, VariantMap } from "./types.js";

export type {
  ClassValue,
  CompoundRule,
  InferProps,
  TvsBuilder,
  TvsOptions,
  VariantMap,
  VariantProps,
} from "./types.js";

function toKey(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (v === true) return "true";
  if (v === false) return "false";
  return v as string;
}

export function matchesCompound<V extends VariantMap>(
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

/** Default `tvs` instance with no custom merge function. */
export function tvs(base: string): TvsBuilder<Record<never, never>, Record<never, never>> {
  return makeBuilder(
    base,
    {} as Record<never, never>,
    {} as Record<never, never>,
    [],
    undefined,
    false,
    matchesCompound,
  );
}

/** Default `cn` instance with no custom merge function. */
export function cn(...args: ClassValue[]): string {
  return joinClassValues(args);
}
