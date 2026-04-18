# typed-variant-system

Type-safe CSS class variant builder. A maintained, feature-rich CVA replacement with recipe composition.

Build component variants with a fluent API, full TypeScript inference, optional class merging, compound rules, boolean shorthands, and shared variant contracts via recipes.

```bash
npm install typed-variant-system
```

**< 1 KB gzipped · zero dependencies · full TypeScript inference**

---

## Basic usage

```ts
import { tvs } from "typed-variant-system";

const button = tvs("btn inline-flex items-center font-medium transition-colors")
  .variants({
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-transparent hover:bg-accent",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-6 text-base",
    },
  })
  .defaults({ variant: "default", size: "md" });

button({ variant: "outline", size: "sm" });
// → "btn … border border-input … h-8 px-3 text-xs"

button({});
// → default variant + md size (defaults applied)

button({ variant: "ghost", class: "w-full" });
// → "btn … hover:bg-accent … h-9 px-4 text-sm w-full"
```

---

## Features

### Defaults

Variants with a default become optional at the call site; all others remain required.

```ts
const badge = tvs("badge rounded-full px-2 py-0.5 text-xs font-medium")
  .variants({
    variant: {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-white",
      outline: "border border-current",
    },
  })
  .defaults({ variant: "default" });

badge({}); // → uses "default"
badge({ variant: "destructive" }); // → destructive styles
```

### Boolean variants

When a variant value is a plain string instead of a record, it becomes a boolean toggle — applied when `true`, omitted otherwise.

```ts
const button = tvs("btn")
  .variants({
    loading: "opacity-70 pointer-events-none", // boolean
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
    },
  })
  .defaults({ size: "md", loading: false });

button({ loading: true }); // → "btn opacity-70 pointer-events-none h-9 px-4 text-sm"
button({ loading: false }); // → "btn h-9 px-4 text-sm"
```

### Compound variants

Apply extra classes when a specific combination of variants is active.

```ts
const button = tvs("btn")
  .variants({
    variant: { solid: "bg-primary", outline: "border" },
    size: { sm: "h-8", lg: "h-12" },
  })
  .compound([
    { variant: "solid", size: "lg", class: "shadow-lg font-bold" },
    { variant: "outline", size: "sm", class: "text-xs" },
  ]);

button({ variant: "solid", size: "lg" });
// → "btn bg-primary h-12 shadow-lg font-bold"
```

Conditions support arrays (OR) and negation (`{ not: ... }`):

```ts
.compound([
  // applies when size is "sm" or "md"
  { size: ["sm", "md"], class: "compact" },
  // applies when size is neither "sm" nor "md"
  { size: { not: ["sm", "md"] }, class: "spacious" },
  // applies when variant is NOT destructive
  { variant: { not: "destructive" }, class: "ring-1 ring-primary/30" },
])
```

### `VariantProps`

Extract variant prop types from a builder — useful for component definitions.

```ts
import { tvs, type VariantProps } from "typed-variant-system";

const buttonVariants = tvs("btn")
  .variants({
    variant: { default: "bg-primary", outline: "border" },
    size:    { sm: "h-8", md: "h-9", lg: "h-11" },
  })
  .defaults({ variant: "default", size: "md" });

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;
//  → { variant?: "default" | "outline"; size?: "sm" | "md" | "lg" }

function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, class: className })}
      {...props}
    />
  );
}
```

### `cn` — class name merging

Use `cn` for `clsx`-like ad-hoc class merging in JSX:

```ts
import { cn } from "typed-variant-system";

cn("px-4 py-2", isActive && "bg-accent", ["rounded", "text-sm"]);
// → "px-4 py-2 bg-accent rounded text-sm"
```

### Tailwind Merge integration

Use `createTvs` to pre-wire `twMerge` so conflicting Tailwind classes are always resolved correctly:

```ts
import { createTvs } from "typed-variant-system";
import { twMerge } from "tailwind-merge";

// Export a pre-configured pair — use these everywhere in the project
export const { tvs, cn } = createTvs({ merge: twMerge });
```

---

## Recipes

A **recipe** defines a shared variant contract — the keys and their allowed values — with no class strings attached. It lets multiple components declare that they implement the same variant interface, and TypeScript enforces it.

### Define a recipe

```ts
import { recipe } from "typed-variant-system";

export const sizeVariants = recipe({ size: ["sm", "default", "lg"] as const });
export const intentShape = recipe({ intent: ["default", "secondary", "destructive"] as const });
```

### Calling a recipe directly

Recipes are **callable** — `sizeVariants("base")` is shorthand for `tvs("base", sizeVariants)` and the primary way to create a constrained builder:

```ts
import { sizeVariants, intentShape } from "./shapes";

const input = sizeVariants("input rounded-xl border bg-input/50 px-3")
  .variants({
    size: { sm: "h-7 text-xs", default: "h-9 text-sm", lg: "h-10 text-base" },
  })
  .defaults({ size: "default" });

// TypeScript error — "xl" is not in sizeVariants:
sizeVariants("...").variants({ size: { xl: "h-14" } }); // ✗
```

Compose recipes first, then call:

```ts
const button = sizeVariants
  .and(intentShape)("btn font-medium transition-colors")
  .variants({
    size: { sm: "h-8 px-3 text-xs", default: "h-9 px-4 text-sm", lg: "h-11 px-6 text-base" },
    intent: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-white",
    },
  })
  .defaults({ size: "default", intent: "default" });
```

Extra variant keys beyond what the recipe declares are always allowed:

```ts
const button = sizeVariants("btn").variants({
  size: { sm: "h-8", default: "h-9", lg: "h-11" }, // required by recipe
  loading: "opacity-70 pointer-events-none", // extra — always allowed
});
```

You can also pass recipes as arguments to `tvs` — both forms are equivalent:

```ts
sizeVariants("btn").variants({ ... })
tvs("btn", sizeVariants).variants({ ... })   // same thing
```

### `recipe.implement()` — stamp a recipe with classes directly

```ts
const sizeClasses = sizeVariants
  .implement({
    base: "transition-all",
    size: {
      sm: "h-8 text-xs",
      default: "h-9 text-sm",
      lg: "h-11 text-base",
    },
  })
  .defaults({ size: "default" });

sizeClasses({ size: "sm" }); // → "transition-all h-8 text-xs"
sizeClasses({}); // → "transition-all h-9 text-sm"
```

### `.and()` — strict composition

Composes two recipes. TypeScript errors at compile time if they share any key.

```ts
const shape = sizeVariants.and(intentShape);
// → Recipe<{ size: [...], intent: [...] }>

// Conflict → compile-time error:
const bad = sizeVariants.and(recipe({ size: ["xs", "2xl"] as const })); // ✗
```

### `.merge()` — soft composition

Composes two recipes by unioning the values of conflicting keys instead of erroring. Useful when extending a shared base with additional values.

```ts
const baseSizes = recipe({ size: ["sm", "default", "lg"] as const });
const extraSizes = recipe({ size: ["xl", "2xl"] as const });

const extended = baseSizes.merge(extraSizes);
// → Recipe<{ size: ["sm","default","lg","xl","2xl"] }>

const heading = tvs("heading", extended).variants({
  size: {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  },
});
```

### `.variants()` — ad-hoc recipe extension

Extend a recipe with extra keys inline, without defining a new shared shape:

```ts
const buttonShape = sizeVariants.variants({ loading: ["idle", "pending"] as const });
// → Recipe<{ size: [...], loading: ["idle","pending"] }>
```

### The `Recipe` type

Use the `Recipe` type to annotate a recipe variable or function parameter:

```ts
import { recipe, type Recipe } from "typed-variant-system";

function makeInput(shape: Recipe<{ size: readonly ["sm", "default", "lg"] }>) {
  return tvs("input", shape).variants({
    size: { sm: "h-7", default: "h-9", lg: "h-11" },
  });
}

makeInput(sizeVariants); // ✓
```

---

## API reference

| Export                   | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| `tvs(base, ...recipes?)` | Create a variant builder. Optional recipes constrain `.variants()`.           |
| `recipe(shape)`          | Define a variant schema (keys + allowed values) with no class strings.        |
| `createTvs(options)`     | Factory returning a `tvs` + `cn` pair pre-wired with a custom merge function. |
| `cn(...values)`          | `clsx`-compatible class name helper.                                          |
| `VariantProps<T>`        | Infer variant props from a builder (excludes `class` / `className`).          |
| `Recipe<S>`              | Type of a recipe object, for annotations.                                     |

### `TvsBuilder` methods

| Method             | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `.variants(map)`   | Define variant keys and class mappings. Called once.                  |
| `.defaults(map)`   | Set default values, making those variants optional at call site.      |
| `.compound(rules)` | Add rules that apply extra classes for specific variant combinations. |

### `Recipe` methods

| Method                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `.and(other)`         | Strict compose — type error if keys conflict.     |
| `.merge(other)`       | Soft compose — unions values of conflicting keys. |
| `.variants(extra)`    | Add extra keys to the recipe shape.               |
| `.implement(classes)` | Stamp with class strings, returns a `TvsBuilder`. |

---

## Documentation

Full documentation is in [`apps/docs/`](./apps/docs/):

- [Getting Started](./apps/docs/getting-started.md)
- [API Reference](./apps/docs/api-reference.md)
- [Recipes](./apps/docs/recipes.md)
- [Examples](./apps/docs/examples.md)
- [Edge Cases](./apps/docs/edge-cases.md)

---

## Development

```bash
vp install   # install dependencies
vp test      # run tests
vp pack      # build the library
```
