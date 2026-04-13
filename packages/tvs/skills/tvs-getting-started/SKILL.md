---
name: tvs-getting-started
description: >
  Full setup guide for @ntatoud/tvs v0.1.0 — type-safe class variance builder.
  Covers install, tvs(base).variants().defaults() builder chain, class/className
  override props with clsx syntax, createTvs({ merge: twMerge }) for Tailwind
  projects, cn utility, and VariantProps type helper for component prop types.
  Preempts: calling .variants() twice (runtime throw), wiring twMerge outside the factory.
type: lifecycle
library: "@ntatoud/tvs"
library_version: "0.1.0"
sources:
  - "ntatoud/tvs:packages/tvs/src/index.ts"
  - "ntatoud/tvs:packages/tvs/README.md"
---

# Getting Started with @ntatoud/tvs

## 1. Setup

Install the package — no peer dependencies required.

```sh
# npm
npm install @ntatoud/tvs

# pnpm
pnpm add @ntatoud/tvs

# yarn
yarn add @ntatoud/tvs
```

Minimum viable example — a typed button component:

```ts
// button.ts
import { tvs, type VariantProps } from "@ntatoud/tvs";

export const button = tvs("btn")
  .variants({
    size: { sm: "text-sm px-2 py-1", md: "text-base px-4 py-2", lg: "text-lg px-6 py-3" },
    intent: { primary: "bg-blue-600 text-white", danger: "bg-red-600 text-white" },
  })
  .defaults({ size: "md" });

export type ButtonProps = VariantProps<typeof button>;
// { size?: "sm" | "md" | "lg"; intent: "primary" | "danger" }
```

```ts
// usage
import { button } from "./button";

button({ intent: "primary" });
// → "btn text-base px-4 py-2 bg-blue-600 text-white"

button({ size: "sm", intent: "danger" });
// → "btn text-sm px-2 py-1 bg-red-600 text-white"
```

---

## 2. Core Patterns

### Pattern 1 — Compound variants

`.compound()` applies extra classes when multiple variant conditions are met simultaneously.

```ts
import { tvs } from "@ntatoud/tvs";

const button = tvs("btn")
  .variants({
    size: { sm: "text-sm", lg: "text-lg" },
    color: { red: "bg-red-500", blue: "bg-blue-500" },
  })
  .defaults({ size: "sm" })
  .compound([{ size: "sm", color: "red", class: "ring-2 ring-red-300" }]);

button({ color: "red" });
// → "btn text-sm bg-red-500 ring-2 ring-red-300"

button({ size: "lg", color: "red" });
// → "btn text-lg bg-red-500"  (compound rule does not match)
```

### Pattern 2 — class and className override props

Both `class` and `className` are accepted. They support clsx syntax: strings, arrays, objects, and functions.

```ts
import { tvs } from "@ntatoud/tvs";

const badge = tvs("badge").variants({ color: { green: "bg-green-500", gray: "bg-gray-300" } });

badge({ color: "green", class: "rounded-full" });
// → "badge bg-green-500 rounded-full"

badge({ color: "gray", className: ["mt-2", { hidden: false, block: true }] });
// → "badge bg-gray-300 mt-2 block"
```

### Pattern 3 — Boolean shorthand variants

Pass a plain string instead of a `{ true: "...", false: "..." }` map to get an opt-in boolean prop.

```ts
import { tvs } from "@ntatoud/tvs";

const input = tvs("input border").variants({
  disabled: "opacity-50 cursor-not-allowed",
  full: "w-full",
});

input({ disabled: true, full: true });
// → "input border opacity-50 cursor-not-allowed w-full"

input({});
// → "input border"
```

### Pattern 4 — Tailwind Merge via createStyra

Create a project-scoped `tvs` and `cn` that pipe every output through `twMerge`. Export them once and import everywhere.

```ts
// lib/tvs.ts
import { createTvs } from "@ntatoud/tvs";
import { twMerge } from "tailwind-merge";

export const { tvs, cn } = createTvs({ merge: twMerge });
```

```ts
// components/card.ts
import { tvs, cn } from "@/lib/tvs";
import type { VariantProps } from "@ntatoud/tvs";

export const card = tvs("p-4 rounded-lg")
  .variants({ shadow: { sm: "shadow-sm", lg: "shadow-lg" } })
  .defaults({ shadow: "sm" });

export type CardProps = VariantProps<typeof card>;

// cn accepts the same clsx-compatible syntax and uses twMerge internally
const classes = cn("p-4", ["rounded", { "border border-gray-200": true }]);
```

---

## 3. Common Mistakes

### [CRITICAL] Calling .variants() twice on the same builder

**Wrong**

```ts
import { tvs } from "@ntatoud/tvs";

const button = tvs("btn")
  .variants({ size: { sm: "text-sm", lg: "text-lg" } })
  .variants({ color: { red: "bg-red-500" } }); // throws at runtime
```

**Correct**

```ts
import { tvs } from "@ntatoud/tvs";

const button = tvs("btn").variants({
  size: { sm: "text-sm", lg: "text-lg" },
  color: { red: "bg-red-500" },
});
```

`.variants()` can only be called once per builder. Calling it a second time throws `"tvs: .variants() can only be called once per builder"`. Declare all variants in a single call.

Source: `ntatoud/tvs:packages/tvs/src/index.ts`

---

### [HIGH] Wiring twMerge outside the factory

**Wrong**

```ts
import { tvs } from "@ntatoud/tvs";
import { twMerge } from "tailwind-merge";

const button = tvs("btn").variants({ size: { sm: "p-1", lg: "p-4" } });

// Bypasses the builder's class/className resolution — merges raw output only
const classes = twMerge(button({ size: "sm", class: "p-2" }));
```

**Correct**

```ts
import { createTvs } from "@ntatoud/tvs";
import { twMerge } from "tailwind-merge";

export const { tvs, cn } = createTvs({ merge: twMerge });

const button = tvs("btn").variants({ size: { sm: "p-1", lg: "p-4" } });

// twMerge runs on the full resolved class string, including class/className overrides
button({ size: "sm", class: "p-2" });
```

Wrapping the output of `button(...)` in `twMerge()` directly means the merge runs after resolution but ignores how override props interact with base and variant classes. Use `createTvs({ merge: twMerge })` so every resolved output — including `class`/`className` overrides — is merged correctly.

Source: `ntatoud/tvs:packages/tvs/src/index.ts`

---

### [MEDIUM] Using raw inferred props instead of VariantProps for component typing

**Wrong**

```ts
import { tvs } from "@ntatoud/tvs";

const button = tvs("btn").variants({ intent: { primary: "bg-blue-600" } });

// Parameters<typeof button>[0] includes class and className — leaks internal props
type ButtonProps = Parameters<typeof button>[0];

function Button(props: ButtonProps) {
  /* ... */
}
```

**Correct**

```ts
import { tvs, type VariantProps } from "@ntatoud/tvs";

const button = tvs("btn").variants({ intent: { primary: "bg-blue-600" } });

// VariantProps strips class and className — only variant keys remain
export type ButtonProps = VariantProps<typeof button>;
// { intent: "primary" }

function Button(props: ButtonProps) {
  /* ... */
}
```

`VariantProps<T>` is defined as `Omit<Parameters<T>[0], "class" | "className">`. Using raw `Parameters<T>[0]` exposes `class` and `className` as public component props, which are internal override props not meant for consumers.

Source: `ntatoud/tvs:packages/tvs/src/types.ts`
