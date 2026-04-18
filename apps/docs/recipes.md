# Recipes

Recipes let you define **reusable variant schemas** the shape (keys and allowed values) of a variant group separately from the class strings that implement them. This is the core tool for sharing variant contracts across a design system.

## Why Recipes

In a typical design system many components share the same variant axes. For example, a `size` variant with values `sm | md | lg` appears on buttons, inputs, badges, and icons. Without recipes you repeat the same key/value structure in every component. Recipes let you define the shape once and stamp it with component-specific classes wherever needed.

## Defining a Recipe

```ts
import { recipe } from "typed-variant-system";

export const sizeRecipe = recipe({
  size: ["sm", "md", "lg"] as const,
});

export const intentRecipe = recipe({
  intent: ["primary", "secondary", "danger", "ghost"] as const,
});
```

The `as const` assertion is required to preserve the literal string types.

## Using a Recipe

Call the recipe as a function with a base class string. It returns a constrained `TvsBuilder` — shorthand for `tvs(base, recipe)`.

```ts
const inputVariants = sizeRecipe("w-full rounded border bg-white").variants({
  size: {
    sm: "h-7 px-2 text-sm",
    md: "h-9 px-3 text-base",
    lg: "h-11 px-4 text-lg",
  },
});

inputVariants({ size: "sm" }); // → "w-full ... h-7 px-2 text-sm"
```

Pass an empty string if you don't need a base class.

## Composing Recipes

### `.and()` strict composition

Merges two recipes into one. TypeScript will produce an error at the composition site if any variant key is shared.

```ts
export const intentAndSize = intentRecipe.and(sizeRecipe);
// intentAndSize.size   → "sm" | "md" | "lg"
// intentAndSize.intent → "primary" | "secondary" | "danger" | "ghost"
```

```ts
// Error: recipes share the "size" key
const bad = sizeRecipe.and(recipe({ size: ["xs"] as const })); // TS error
```

### `.merge()` soft composition

Like `.and()` but unions the allowed values of conflicting keys instead of erroring.

```ts
const base = recipe({ size: ["sm", "md"] as const });
const extend = recipe({ size: ["lg", "xl"] as const });

export const extendedSize = base.merge(extend);
// extendedSize.size → "sm" | "md" | "lg" | "xl"
```

Use `.merge()` when you own a base recipe and want to extend it with additional values.

### `.variants()` add keys

Adds new variant keys to the recipe shape without conflict checking.

```ts
const withLoading = sizeRecipe.variants({
  loading: ["idle", "pending", "done"] as const,
});
```

## Using Recipes with `tvs()`

Pass a recipe as a second argument to `tvs()`. The builder's `.variants()` call will be type-checked against the recipe's allowed values.

```ts
import { tvs } from "typed-variant-system";
import { intentAndSize } from "./recipes";

const buttonVariants = tvs("inline-flex items-center rounded", intentAndSize)
  .variants({
    intent: {
      primary: "bg-blue-600 text-white",
      secondary: "bg-gray-100 text-gray-900",
      danger: "bg-red-600 text-white",
      ghost: "text-gray-700",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-5 text-lg",
    },
  })
  .defaults({ intent: "primary", size: "md" });
```

If you provide a value for `intent` that is not in the recipe, TypeScript reports an error.

## Calling a Recipe Directly

A recipe is also callable as a function, which is syntactic sugar for `tvs(base, recipe)`:

```ts
const badgeVariants = intentRecipe("rounded-full px-2 py-0.5 text-xs").variants({
  intent: {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    danger: "bg-red-100 text-red-800",
    ghost: "bg-transparent text-gray-700",
  },
});
```

## Sharing Recipes Across a Project

A recommended pattern is to export all design-system recipes from a single file:

```ts
// lib/recipes.ts
import { recipe } from "typed-variant-system";

export const sizeRecipe = recipe({
  size: ["sm", "default", "lg"] as const,
});

export const intentRecipe = recipe({
  intent: ["default", "secondary", "destructive", "outline", "ghost", "link"] as const,
});

export const intentAndSize = intentRecipe.and(sizeRecipe);
```

Components import from this file to ensure they share the same variant vocabulary.

## Recipe Type Utilities

### `RecipeMap`

The raw shape type: `Record<string, readonly string[]>`.

### `VariantMapOf<S>`

Given a recipe shape `S`, produces the variant map type — the class object you'd pass to `.variants()` when using the recipe.

```ts
import { recipe } from "typed-variant-system";
import type { VariantMapOf } from "typed-variant-system";

const shape = { size: ["sm", "lg"] as const };
type Classes = VariantMapOf<typeof shape>;
// → { size: { sm: string; lg: string }; base?: string }
```

### `RecipeClasses<T>`

Given a `Recipe<S>`, extracts the `VariantMapOf<S>` type.
