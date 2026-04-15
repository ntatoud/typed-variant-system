# tvs

Type-safe class variance builder. A maintained, feature-rich CVA replacement.

Build component variants with a fluent API, full TypeScript inference, optional class merging, compound rules, and boolean shorthands.

## Installation

```bash
npm install tvs
```

## Usage

```ts
import { tvs } from "tvs";

const button = tvs("btn")
  .variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .defaults({ size: "md" })
  .compound([{ size: "sm", color: "red", class: "ring-red" }]);

button({ color: "red" }); // 'btn text-md bg-red'
button({ size: "sm", color: "red" }); // 'btn text-sm bg-red ring-red'
```

## Features

### Custom merge function

Pass any merge function (e.g. `tailwind-merge`) to resolve class conflicts:

```ts
import { createTvs } from "tvs";
import { twMerge } from "tailwind-merge";

export const { tvs } = createTvs({ merge: twMerge });
```

### Boolean variants

Use boolean shorthands for flags like `disabled` or `loading`:

```tsx
<Button loading />
```

### Compound rules

Apply classes only when a specific combination of variants is active:

```ts
const btn = tvs("btn")
  .variants({
    size: { sm: "text-sm", lg: "text-lg" },
    disabled: { yes: "opacity-50", no: "" },
  })
  .compound([{ disabled: { not: "yes" }, class: "hover:opacity-80" }]);
```

Compound conditions also accept arrays for OR matching and `{ not: [...] }` for none-of matching:

```ts
const btn = tvs("btn")
  .variants({ size: { sm: "text-sm", md: "text-md", lg: "text-lg" } })
  .compound([
    // applies when size is "sm" or "md"
    { size: ["sm", "md"], class: "compact" },
    // applies when size is neither "sm" nor "md"
    { size: { not: ["sm", "md"] }, class: "spacious" },
  ]);
```

### Merging class names

Use the `cn` utility for `clsx`-like class merging:

```ts
import { cn } from "tvs";

cn("px-4", condition && "py-2", ["rounded", "text-sm"]); // 'px-4 py-2 rounded text-sm'
```

### Recipes

Recipes are reusable variant schemas — they define the structure (variant keys and their possible values) with no class names attached. Classes are provided separately when stamping a builder, so the same recipe can be reused across components with different styles.

**Create a recipe:**

```ts
import { createRecipe } from "tvs";

const sizeRecipe = createRecipe({ size: ["sm", "md", "lg"] });
const intentRecipe = createRecipe({ intent: ["primary", "secondary", "destructive"] });
```

**Extend recipes** to combine their variant keys (later recipe wins on conflicts):

```ts
const buttonRecipe = sizeRecipe.extend(intentRecipe);
```

**Create a builder** with `.implement(classes)`. TypeScript enforces that every declared value is covered:

```ts
const buttonVariants = sizeRecipe.extend(intentRecipe).implement({
  size: { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm", lg: "h-11 px-6 text-base" },
  intent: {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500 text-white",
  },
});

buttonVariants({ size: "md", intent: "primary" }); // 'h-9 px-4 text-sm bg-blue-500 text-white'
```

Pass a base class via the `class` prop when needed:

```ts
buttonVariants({ size: "md", intent: "primary", class: "btn rounded-md" });
```

All builder methods (`.defaults()`, `.compound()`) work normally after `.implement()`.

### VariantProps

Extract variant prop types for use in component definitions:

```ts
import type { VariantProps } from "tvs";

type ButtonProps = VariantProps<typeof button>;
```

## Development

```bash
vp install   # install dependencies
vp test      # run tests
vp pack      # build the library
```
