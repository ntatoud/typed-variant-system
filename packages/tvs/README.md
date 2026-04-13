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
