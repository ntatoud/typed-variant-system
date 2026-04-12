---
name: styra-compound-variants
description: >
  Compound variant rules for @ntatoud/styra v0.1.0 — .compound([rules]) syntax,
  exact-match conditions (all keys must match for rule to fire), Not<T> negation
  ({ variantKey: { not: value } } — fires when variant is NOT that value),
  multiple independent rules (additive), boolean shorthand coercion ("true"/"false"
  string keys in negation). Exports: CompoundRule, Not.
  Preempts: { not: true } instead of { not: "true" } for boolean props,
  missing class key in rule, compoundVariants CVA migration pitfall.
type: core
library: "@ntatoud/styra"
library_version: "0.1.0"
requires:
  - styra-define-variants
sources:
  - "ntatoud/styra:packages/styra/src/index.ts"
  - "ntatoud/styra:packages/styra/src/types.ts"
---

# Compound Variants

This skill builds on styra-define-variants. Read it first for foundational concepts.

## 1. Setup

Minimum viable example — exact-match rule and negation rule:

```ts
import { styra, type CompoundRule, type Not } from "@ntatoud/styra";

// Exact-match: ring-red only when size=sm AND color=red
const button = styra("btn")
  .variants({
    size: { sm: "text-sm", md: "text-base", lg: "text-lg" },
    color: { red: "bg-red-500", blue: "bg-blue-500" },
  })
  .compound([{ size: "sm", color: "red", class: "ring-2 ring-red-300" }]);

button({ size: "sm", color: "red" });
// → "btn text-sm bg-red-500 ring-2 ring-red-300"

button({ size: "md", color: "red" });
// → "btn text-base bg-red-500"  (size is md, rule doesn't fire)
```

```ts
import { styra } from "@ntatoud/styra";

// Negation: hover:opacity-80 on everything EXCEPT when size=sm
const button = styra("btn")
  .variants({
    size: { sm: "text-sm", md: "text-base", lg: "text-lg" },
    color: { red: "bg-red-500", blue: "bg-blue-500" },
  })
  .compound([{ size: { not: "sm" }, color: "red", class: "hover:opacity-80" }]);

button({ size: "md", color: "red" });
// → "btn text-base bg-red-500 hover:opacity-80"

button({ size: "sm", color: "red" });
// → "btn text-sm bg-red-500"  (negation blocks the rule)
```

---

## 2. Core Patterns

### Pattern 1 — Multiple independent rules (additive)

All rules are evaluated independently. Every matching rule contributes its class.

```ts
import { styra } from "@ntatoud/styra";

const badge = styra("badge")
  .variants({
    size: { sm: "text-sm", lg: "text-lg" },
    color: { red: "bg-red-500", blue: "bg-blue-500" },
    outlined: "border-2",
  })
  .compound([
    { size: "sm", color: "red", class: "ring-red-300" },
    { outlined: "true", color: "red", class: "border-red-500" },
  ]);

badge({ size: "sm", color: "red", outlined: true });
// → "badge text-sm bg-red-500 border-2 ring-red-300 border-red-500"
// Both rules matched — both classes applied.

badge({ size: "lg", color: "red", outlined: true });
// → "badge text-lg bg-red-500 border-2 border-red-500"
// Only second rule matched — ring not applied.
```

### Pattern 2 — Negation with Not<T>

`{ not: value }` makes a condition fire when the variant is anything other than `value`.

```ts
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({
    size: { sm: "text-sm", md: "text-base", lg: "text-lg" },
  })
  .compound([
    // Apply hover effect on md and lg, but not sm
    { size: { not: "sm" }, class: "hover:brightness-110" },
  ]);

button({ size: "md" });
// → "btn text-base hover:brightness-110"

button({ size: "lg" });
// → "btn text-lg hover:brightness-110"

button({ size: "sm" });
// → "btn text-sm"
```

### Pattern 3 — Boolean shorthand with negation

Boolean shorthand variants store their state as the string `"true"` or `"false"` internally. Negation must use the string form.

```ts
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({
    size: { sm: "text-sm", lg: "text-lg" },
    disabled: "opacity-50 cursor-not-allowed",
  })
  .compound([
    // hover effect applies only when disabled is falsy
    { disabled: { not: "true" }, class: "hover:opacity-80" },
  ]);

button({ size: "sm" });
// → "btn text-sm hover:opacity-80"  (disabled not set → rule fires)

button({ size: "sm", disabled: false });
// → "btn text-sm hover:opacity-80"  (disabled=false → "false", not "true" → rule fires)

button({ size: "sm", disabled: true });
// → "btn text-sm opacity-50 cursor-not-allowed"  (disabled=true → "true" → negation blocks rule)
```

### Pattern 4 — Using CompoundRule and Not for typed rule arrays

When building rules outside the builder call, use the exported generic types.

```ts
import { styra, type CompoundRule, type Not } from "@ntatoud/styra";
import type { VariantProps } from "@ntatoud/styra";

const button = styra("btn").variants({
  size: { sm: "text-sm", md: "text-base", lg: "text-lg" },
  color: { red: "bg-red-500", blue: "bg-blue-500" },
});

type V = Parameters<typeof button>[0];

// CompoundRule<V> enforces that all keys match variant names and class is present
const rules: CompoundRule<{
  size: { sm: string; md: string; lg: string };
  color: { red: string; blue: string };
}>[] = [
  { size: "sm", color: "red", class: "ring-red-300" },
  { size: { not: "lg" }, class: "shadow-sm" },
];

const styledButton = button.compound(rules);

styledButton({ size: "sm", color: "red" });
// → "btn text-sm bg-red-500 ring-red-300 shadow-sm"
```

---

## 3. Common Mistakes

### [CRITICAL] Using boolean `true` instead of string `"true"` in negation

**Wrong**

```ts
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({ disabled: "opacity-50" })
  .compound([
    { disabled: { not: true }, class: "hover:opacity-80" }, // not: true — boolean, never matches
  ]);

button({ disabled: true });
// → "btn opacity-50 hover:opacity-80"  (unexpected — hover should NOT apply)
```

**Correct**

```ts
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({ disabled: "opacity-50" })
  .compound([
    { disabled: { not: "true" }, class: "hover:opacity-80" }, // not: "true" — string key
  ]);

button({ disabled: true });
// → "btn opacity-50"  (hover correctly blocked)
```

Boolean shorthand variants coerce `true`/`false` props to the string keys `"true"`/`"false"` internally. The negation value must match the stored string key, not the JavaScript boolean. Source: `ntatoud/styra:packages/styra/src/index.ts`

---

### [HIGH] Omitting the `class` key in a compound rule

**Wrong**

```ts
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({ size: { sm: "text-sm", lg: "text-lg" }, color: { red: "bg-red-500" } })
  .compound([
    { size: "sm", color: "red" }, // TypeScript error: missing 'class' property
  ]);
```

**Correct**

```ts
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({ size: { sm: "text-sm", lg: "text-lg" }, color: { red: "bg-red-500" } })
  .compound([{ size: "sm", color: "red", class: "ring-red-300" }]);
```

`CompoundRule<V>` requires `class: string`. TypeScript will catch the omission at compile time; at runtime the rule is silently skipped because there is no class to apply. Always include the `class` key. Source: `ntatoud/styra:packages/styra/src/types.ts`

---

### [HIGH] CVA migration: compoundVariants array instead of .compound()

**Wrong**

```ts
import { styra } from "@ntatoud/styra";

// CVA-style API — does not exist in styra
const button = styra("btn", {
  variants: { size: { sm: "text-sm", lg: "text-lg" } },
  compoundVariants: [{ size: "sm", class: "ring-sm" }], // ignored — not a valid option
});
```

**Correct**

```ts
import { styra } from "@ntatoud/styra";

const button = styra("btn")
  .variants({ size: { sm: "text-sm", lg: "text-lg" } })
  .compound([{ size: "sm", class: "ring-sm" }]);
```

Styra uses a builder chain, not a config object. Compound rules are attached via `.compound([...])` on the builder, not a `compoundVariants` key. Source: `ntatoud/styra:packages/styra/src/index.ts`

---

### [MEDIUM] Writing a compound rule when a default or boolean variant is simpler

**Wrong**

```ts
import { styra } from "@ntatoud/styra";

// Using compound just to apply a class when a single variant has a specific value
const button = styra("btn")
  .variants({ intent: { primary: "bg-blue-600", danger: "bg-red-600" } })
  .compound([
    { intent: "primary", class: "text-white" },
    { intent: "danger", class: "text-white" },
  ]);
```

**Correct**

```ts
import { styra } from "@ntatoud/styra";

// Just include the class in the variant map
const button = styra("btn").variants({
  intent: {
    primary: "bg-blue-600 text-white",
    danger: "bg-red-600 text-white",
  },
});
```

`.compound()` is for cases where a class depends on the intersection of two or more variant values simultaneously. Single-variant class assignments belong directly in the variant map. Source: `ntatoud/styra:packages/styra/src/index.ts`
