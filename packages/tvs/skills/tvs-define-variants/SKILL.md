---
name: tvs-define-variants
description: >
  Define typed variant maps (size, color, state flags) on a tvs builder using
  .variants(), boolean shorthand, .defaults(), and VariantProps. Covers
  class/className ClassValue inputs, optional vs required variant inference, and
  compound-rule key coercion.
type: core
library: "tvs"
library_version: "0.1.0"
requires:
  - tvs-getting-started
sources:
  - "ntatoud/tvs:packages/tvs/src/types.ts"
  - "ntatoud/tvs:packages/tvs/src/index.ts"
---

This skill builds on tvs-getting-started. Read it first for foundational concepts.

## Setup

```ts
import { tvs, type VariantProps, type ClassValue } from "tvs";

const buttonVariants = tvs("btn")
  .variants({
    size: { sm: "text-sm px-2 py-1", md: "text-base px-4 py-2", lg: "text-lg px-6 py-3" },
    color: { primary: "bg-blue-600 text-white", danger: "bg-red-600 text-white" },
    disabled: "opacity-50 pointer-events-none",
  })
  .defaults({ size: "md" });

type ButtonProps = VariantProps<typeof buttonVariants>;
// → { size?: "sm" | "md" | "lg"; color: "primary" | "danger"; disabled?: boolean }
```

## Core Patterns

### Standard variant map

Pass an object of string keys to string values. Each key becomes a prop; each value becomes the class applied when that key is selected.

```ts
import { tvs } from "tvs";

const badge = tvs("badge").variants({
  size: {
    sm: "text-xs px-1",
    md: "text-sm px-2",
    lg: "text-base px-3",
  },
  color: {
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
  },
});

badge({ size: "sm", color: "blue" }); // "badge text-xs px-1 bg-blue-100 text-blue-800"
```

All variant keys are required unless covered by `.defaults()`.

### Boolean shorthand

When a variant value is a plain string instead of an object, the prop becomes `boolean`. The string is applied when the prop is `true`; nothing is applied when it is `false` or `undefined`.

```ts
import { tvs } from "tvs";

const btn = tvs("btn").variants({
  disabled: "opacity-50 pointer-events-none",
  active: "ring-2 ring-offset-2",
});

btn({ disabled: true, active: false }); // "btn opacity-50 pointer-events-none"
btn({ disabled: false, active: true }); // "btn ring-2 ring-offset-2"
btn({ disabled: false, active: false }); // "btn"
```

Internally the shorthand `"opacity-50 pointer-events-none"` is stored as `{ true: "opacity-50 pointer-events-none", false: "" }`. The boolean prop value is coerced to the string `"true"` or `"false"` for map lookup.

### Making variants optional with `.defaults()`

Call `.defaults()` with a partial map of variant keys to their default values. Variants covered by a default become optional in the inferred props type; uncovered variants remain required.

```ts
import { tvs, type VariantProps } from "tvs";

const chip = tvs("chip")
  .variants({
    size: { sm: "text-xs", md: "text-sm", lg: "text-base" },
    color: { blue: "bg-blue-100", green: "bg-green-100" },
  })
  .defaults({ size: "md" });

// size is optional (has default); color is required (no default)
type ChipProps = VariantProps<typeof chip>;
// → { size?: "sm" | "md" | "lg"; color: "blue" | "green" }

chip({ color: "blue" }); // "chip text-sm bg-blue-100"
chip({ size: "lg", color: "green" }); // "chip text-base bg-green-100"
```

### `class` and `className` ClassValue inputs

Both `class` and `className` props accept a `ClassValue`: a string, number, boolean, null, undefined, an array of `ClassValue`, or a `Record<string, unknown>` where truthy values include the key as a class. `className` also accepts a render-prop function returning `ClassValue`.

```ts
import { tvs, type ClassValue } from "tvs";

const btn = tvs("btn").variants({ disabled: "opacity-50" });

// String
btn({ disabled: false, class: "mt-4" }); // "btn mt-4"

// Array
btn({ disabled: true, class: ["mt-4", "px-2"] }); // "btn opacity-50 mt-4 px-2"

// Object map — truthy values include the key
btn({ disabled: false, class: { "mt-4": true, "px-2": false } }); // "btn mt-4"

// Mixed array
btn({ disabled: false, class: ["mt-4", { "px-2": true, "py-1": false }] }); // "btn mt-4 px-2"

// className render-prop (Base UI / headless pattern)
btn({
  disabled: true,
  className: (state: { disabled: boolean }) => (state.disabled ? "cursor-not-allowed" : undefined),
});
```

`VariantProps<T>` strips both `class` and `className` from the inferred type so component prop interfaces stay clean.

## Common Mistakes

### [CRITICAL] Omitting a required variant silently produces no class

Without a default, a missing variant resolves to `undefined`, which maps to no class. TypeScript catches this, but only when `VariantProps` is used for the component's prop type.

```ts
// Wrong — size has no default and is not passed; TypeScript error is suppressed by `as any`
const card = tvs("card").variants({ size: { sm: "p-2", lg: "p-6" } });
(card as any)({}); // "card" — size class is silently dropped
```

```ts
// Correct — either pass the variant or add a default
const card = tvs("card")
  .variants({ size: { sm: "p-2", lg: "p-6" } })
  .defaults({ size: "sm" });

card({}); // "card p-2"
```

Always use `VariantProps<typeof yourVariants>` as your component's prop type so TypeScript enforces required variants at call sites. Source: `packages/tvs/src/types.ts` — `InferProps`.

### [HIGH] Using `{ true: "...", false: "" }` when boolean shorthand is available

Explicit two-key objects are verbose and error-prone. Boolean shorthand produces the same runtime behavior with less code.

```ts
// Wrong — verbose, no benefit over shorthand
const btn = tvs("btn").variants({
  disabled: { true: "opacity-50 pointer-events-none", false: "" },
});
```

```ts
// Correct — boolean shorthand
const btn = tvs("btn").variants({
  disabled: "opacity-50 pointer-events-none",
});
```

The implementation converts the plain string to `{ true: raw, false: "" }` internally. Source: `packages/tvs/src/index.ts` — `makeBuilder`.

### [HIGH] Passing a boolean key in a compound rule when the stored key is the string `"true"`

Boolean shorthand stores the value under the string key `"true"`, not the JavaScript boolean `true`. Compound rules that reference boolean variants must use the string `"true"`.

```ts
// Wrong — boolean true is not a valid key in a compound rule
const btn = tvs("btn")
  .variants({ disabled: "opacity-50", color: { red: "bg-red-500", blue: "bg-blue-500" } })
  .compounds([{ disabled: true, color: "red", class: "border-red-700" }]); // runtime miss
```

```ts
// Correct — use the string "true" as the key value
const btn = tvs("btn")
  .variants({ disabled: "opacity-50", color: { red: "bg-red-500", blue: "bg-blue-500" } })
  .compounds([{ disabled: "true", color: "red", class: "border-red-700" }]);
```

The `toKey` coercion applies only to incoming prop values, not to the keys written in compound rule objects. Source: `packages/tvs/src/index.ts` — `toKey`.

### [MEDIUM] Expecting `VariantProps` to include `class` or `className`

`VariantProps<T>` deliberately omits `class` and `className`. Use the full `Parameters<T>[0]` type if you need to forward those props, or spread them separately.

```ts
// Wrong — class is stripped from VariantProps
import { type VariantProps } from "tvs";

const btn = tvs("btn").variants({ size: { sm: "text-sm", md: "text-md" } });
type BtnProps = VariantProps<typeof btn> & { onClick: () => void };
// BtnProps has no `class` or `className` — passing class from the parent is a TypeScript error
```

```ts
// Correct — add ClassValue explicitly when the component needs to accept extra classes
import { tvs, type VariantProps, type ClassValue } from "tvs";

const btn = tvs("btn").variants({ size: { sm: "text-sm", md: "text-md" } });
type BtnProps = VariantProps<typeof btn> & { class?: ClassValue; onClick: () => void };
```

Source: `packages/tvs/src/types.ts` — `VariantProps`.
