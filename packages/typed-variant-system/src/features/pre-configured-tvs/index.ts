import { joinClassValues, makeBuilder } from "../internal-core/index.js";
import { matchesCompound } from "../core/index.js";
import type {
  ClassValue,
  MergeRecipes,
  RecipeMap,
  TvsBuilder,
  TvsOptions,
  ValidRecipes,
} from "../core/types.js";

/**
 * Create a configured `tvs` factory.
 *
 * @example
 * ```ts
 * import { createTvs } from 'typed-variant-system'
 * import { twMerge } from 'tailwind-merge'
 *
 * export const { tvs, cn } = createTvs({ merge: twMerge })
 * ```
 */
export function createTvs(options?: TvsOptions) {
  const customMerge = options?.merge;

  function tvs(base: string): TvsBuilder<Record<never, never>, Record<never, never>>;
  function tvs<Rs extends { _recipe: RecipeMap }[]>(
    base: string,
    ...recipes: ValidRecipes<Rs>
  ): TvsBuilder<Record<never, never>, Record<never, never>, MergeRecipes<Rs>>;
  function tvs(
    base: string,
    ...recipes: { _recipe: RecipeMap }[]
  ): TvsBuilder<never, never, RecipeMap> {
    const mergedRecipe: Record<string, readonly string[]> = {};
    for (const r of recipes) {
      Object.assign(mergedRecipe, r._recipe);
    }
    return makeBuilder(
      base,
      {} as Record<never, never>,
      {} as Record<never, never>,
      [],
      customMerge,
      false,
      matchesCompound,
      mergedRecipe as RecipeMap,
    ) as unknown as TvsBuilder<never, never, RecipeMap>;
  }

  function cn(...args: ClassValue[]): string {
    const result = joinClassValues(args);
    return customMerge ? customMerge(result) : result;
  }

  return { tvs, cn };
}
