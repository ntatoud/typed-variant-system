---
name: styra-migrate-from-cva
description: >
  Migrate from CVA (class-variance-authority) to @ntatoud/styra. Maps cva() config object
  syntax to styra builder chain: variants(), defaults(), compound(). Covers cx/clsx → cn,
  VariantProps (unchanged), createStyra for merge config, boolean shorthand variants,
  and negation in compound rules. Use when converting class-variance-authority imports
  or cva() calls to the styra builder API.
type: lifecycle
library: "@ntatoud/styra"
library_version: "0.1.0"
sources:
  - "ntatoud/styra:packages/styra/src/index.ts"
  - "ntatoud/styra:packages/styra/README.md"
---

# Migrate from CVA to styra

This skill covers replacing `class-variance-authority` with `@ntatoud/styra`. The core
difference: CVA uses a single config object; styra uses a builder chain.

## API Mapping

| CVA                                                            | styra                                                |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| `import { cva } from "class-variance-authority"`               | `import { styra } from "@ntatoud/styra"`             |
| `import { cx } from "class-variance-authority"`                | `import { cn } from "@ntatoud/styra"`                |
| `import { type VariantProps } from "class-variance-authority"` | `import { type VariantProps } from "@ntatoud/styra"` |
| `cva(base, { variants })`                                      | `styra(base).variants({})`                           |
| `cva(base, { defaultVariants })`                               | `.defaults({})`                                      |
| `cva(base, { compoundVariants })`                              | `.compound([])`                                      |
| CVA + clsx + twMerge (manual)                                  | `createStyra({ merge: twMerge })`                    |

`VariantProps<typeof fn>` is identical — no change in usage.

## Setup

Remove CVA, install styra:

```bash
vp remove class-variance-authority
vp add @ntatoud/styra
```

## Patterns

### Basic variant component

Before:

```ts
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("btn", {
  variants: {
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue" },
  },
  defaultVariants: { size: "md" },
  compoundVariants: [{ size: "sm", color: "red", class: "ring-red" }],
});

type ButtonProps = VariantProps<typeof button>;
```

After:

```ts
import { styra, type VariantProps } from "@ntatoud/styra";

const button = styra("btn")
  .variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .defaults({ size: "md" })
  .compound([{ size: "sm", color: "red", class: "ring-red" }]);

type ButtonProps = VariantProps<typeof button>;
// → { size?: "sm" | "md" | "lg"; color: "red" | "blue" }
```

### Class merging utility

Before:

```ts
import { cx } from "class-variance-authority";
// or: import clsx from "clsx";

const classes = cx("base", condition && "extra");
```

After:

```ts
import { cn } from "@ntatoud/styra";

const classes = cn("base", condition && "extra");
```

### Tailwind Merge integration

CVA does not natively support a merge function — projects typically wired up clsx + twMerge
manually alongside CVA. Styra integrates merge at creation time via `createStyra`.

Before (typical CVA + twMerge pattern):

```ts
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const button = cva("btn rounded", {
  variants: { size: { sm: "px-2", lg: "px-6" } },
});
```

After:

```ts
// lib/styra.ts
import { createStyra } from "@ntatoud/styra";
import { twMerge } from "tailwind-merge";

export const { styra, cn } = createStyra({ merge: twMerge });
```

```ts
// button.ts
import { styra, cn, type VariantProps } from "./lib/styra";

const button = styra("btn rounded").variants({
  size: { sm: "px-2", lg: "px-6" },
});

type ButtonProps = VariantProps<typeof button>;
```

Import `styra` and `cn` from your local `lib/styra` module everywhere instead of from
`@ntatoud/styra` directly.

### Variants with no default (required prop)

If a variant has no entry in `.defaults()`, its prop is required in the inferred type.

```ts
import { styra, type VariantProps } from "@ntatoud/styra";

const badge = styra("badge")
  .variants({
    status: { info: "bg-blue", warn: "bg-yellow", error: "bg-red" },
    size: { sm: "text-xs", md: "text-sm" },
  })
  .defaults({ size: "md" });
// size is optional (has default), status is required

type BadgeProps = VariantProps<typeof badge>;
// → { status: "info" | "warn" | "error"; size?: "sm" | "md" }
```

### Boolean shorthand variants (new in styra)

CVA did not support boolean variants. In styra, a variant value that is a string (not an
object) defines a boolean prop — the class applies when the prop is `true`.

```ts
import { styra, type VariantProps } from "@ntatoud/styra";

const button = styra("btn")
  .variants({
    size: { sm: "text-sm", lg: "text-lg" },
    disabled: "opacity-50 pointer-events-none", // boolean shorthand
    loading: "cursor-wait", // boolean shorthand
  })
  .defaults({ size: "sm" });

type ButtonProps = VariantProps<typeof button>;
// → { size?: "sm" | "lg"; disabled?: boolean; loading?: boolean }

button({ size: "lg", disabled: true });
// → "btn text-lg opacity-50 pointer-events-none"
```

There is no CVA equivalent — this is new capability. Use it instead of manually adding
conditional classes for simple on/off states.

### Negation in compound rules (new in styra)

CVA compound variants only matched when all listed keys matched. Styra allows negation via
`{ not: value }` in compound entries.

```ts
import { styra, type VariantProps } from "@ntatoud/styra";

const button = styra("btn")
  .variants({
    disabled: "opacity-50 pointer-events-none",
    size: { sm: "text-sm", lg: "text-lg" },
  })
  .compound([
    // Apply hover class only when NOT disabled
    { disabled: { not: "true" }, class: "hover:opacity-80" },
    // Apply ring only when size is sm AND NOT disabled
    { size: "sm", disabled: { not: "true" }, class: "ring-1" },
  ]);
```

There is no CVA equivalent. When migrating compound variants that were previously guarded
by runtime logic, consider whether negation expresses the intent more cleanly.

## Common Mistakes

### Using the CVA config object syntax

Wrong — this is CVA syntax, not valid styra:

```ts
// WRONG
import { styra } from "@ntatoud/styra";

const button = styra("btn", {
  variants: { size: { sm: "text-sm" } },
  defaultVariants: { size: "sm" },
  compoundVariants: [{ size: "sm", class: "ring" }],
});
```

Correct — styra uses a builder chain:

```ts
// CORRECT
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({ size: { sm: "text-sm" } })
  .defaults({ size: "sm" })
  .compound([{ size: "sm", class: "ring" }]);
```

### Keeping `compoundVariants` as a key

Wrong:

```ts
// WRONG — compoundVariants is a CVA key, not a styra method
const button = styra("btn")
  .variants({ size: { sm: "text-sm" } })
  .compoundVariants([{ size: "sm", class: "ring" }]);
```

Correct: the method is `.compound()`.

### Keeping `defaultVariants` as a key

Wrong:

```ts
// WRONG — defaultVariants is a CVA key, not a styra method
const button = styra("btn")
  .variants({ size: { sm: "text-sm", md: "text-md" } })
  .defaultVariants({ size: "md" });
```

Correct: the method is `.defaults()`.

### Not using createStyra when twMerge is needed

Wrong — this bypasses styra's merge integration:

```ts
// WRONG — manually merging outside of styra
import { styra } from "@ntatoud/styra";
import { twMerge } from "tailwind-merge";

const button = styra("btn").variants({ size: { sm: "px-2", lg: "px-6" } });

// Calling twMerge separately
const cls = twMerge(button({ size: "sm" }), "px-4");
```

Correct — configure merge once in `createStyra` and use the returned `styra` and `cn`:

```ts
// lib/styra.ts
import { createStyra } from "@ntatoud/styra";
import { twMerge } from "tailwind-merge";
export const { styra, cn } = createStyra({ merge: twMerge });
```

### Not using boolean shorthand for simple on/off variants

Suboptimal — mirrors old CVA workaround pattern:

```ts
// SUBOPTIMAL — using object syntax for a boolean state
const button = styra("btn").variants({
  disabled: { true: "opacity-50", false: "" },
});
```

Preferred — use boolean shorthand:

```ts
// PREFERRED
const button = styra("btn").variants({
  disabled: "opacity-50 pointer-events-none",
});
// disabled prop is inferred as boolean
```
