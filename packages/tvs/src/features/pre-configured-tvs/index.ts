import { joinClassValues, makeBuilder } from "../internal-core/index.js";
import { matchesCompound } from "../core/index.js";
import type { ClassValue, TvsBuilder, TvsOptions } from "../core/types.js";

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
      matchesCompound,
    );
  }

  function cn(...args: ClassValue[]): string {
    const result = joinClassValues(args);
    return customMerge ? customMerge(result) : result;
  }

  return { tvs, cn };
}
