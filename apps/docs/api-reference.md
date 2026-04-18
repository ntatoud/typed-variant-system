# API Reference

## `tvs(base, ...recipes?)`

Creates a variant builder with the given base class string.

```ts
import { tvs } from "typed-variant-system";

const builder = tvs("base-class");
```

Optionally accepts one or more [recipe](#recipe) instances or plain recipe map objects as additional arguments. The builder will be constrained to the variant keys and allowed values defined by those recipes.

```ts
import { tvs } from "typed-variant-system";
import { sizeRecipe } from "./recipes";

const builder = tvs("base-class", sizeRecipe);
```

**Returns:** `TvsBuilder<V, D, R>`

---

## `TvsBuilder`

The object returned by `tvs()`. It is both callable and has chainable configuration methods.

### Calling the builder

```ts
builder(props): string
```

Resolves all variant classes and returns a single class string.

**Props:**

| Prop        | Type                             | Description                                       |
| ----------- | -------------------------------- | ------------------------------------------------- |
| `[variant]` | inferred from variant map        | Required if no default is set; optional otherwise |
| `class`     | `ClassValue`                     | Extra classes appended after all variants         |
| `className` | `ClassValue \| () => ClassValue` | Same as `class`; supports function form           |

Both `class` and `className` are accepted and combined. When both are provided they are appended in order (`class` first, then `className`).

```ts
button({ variant: "solid", class: "mt-4", className: "w-full" });
```

---

### `.variants(map)`

Defines the variant map for the builder. **Can only be called once per builder.**

```ts
builder.variants({
  size: {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  },
  disabled: "opacity-50 pointer-events-none",
});
```

**Variant map values:**

| Form              | Type                     | Resolved prop type         |
| ----------------- | ------------------------ | -------------------------- |
| Object map        | `Record<string, string>` | `keyof map` (string union) |
| Boolean shorthand | `string`                 | `boolean`                  |

**Boolean shorthand** converts a plain string into `{ true: string, false: "" }` internally. At the call site, the prop type is `boolean`.

```ts
const el = tvs("base").variants({ loading: "opacity-75 cursor-wait" });
el({ loading: true }); // → "base opacity-75 cursor-wait"
el({ loading: false }); // → "base"
```

**Returns:** `TvsBuilder` a new builder instance with the variant types applied.

---

### `.defaults(map)`

Sets default values for any subset of defined variants. Variants with defaults become optional at the call site.

```ts
builder.variants({ size: { sm: "...", md: "...", lg: "..." } }).defaults({ size: "md" });
```

- Variants **without** a default remain required.
- Variants **with** a default become optional; omitting them uses the default.
- Providing an explicit value at the call site always overrides the default.

**Returns:** `TvsBuilder` the same builder with updated default types.

---

### `.compound(rules)`

Adds compound variant rules classes applied only when a specific combination of variant values is active.

```ts
builder
  .variants({ variant: { solid: "...", outline: "..." }, size: { sm: "...", md: "..." } })
  .compound([{ variant: "solid", size: "sm", class: "extra-class-when-both-match" }]);
```

Each rule is an object where every key except `class` is a condition on a variant prop, and `class` is the string to append when all conditions match.

**Condition forms:**

| Condition     | Example                           | Meaning                                 |
| ------------- | --------------------------------- | --------------------------------------- |
| Exact value   | `{ size: "sm" }`                  | matches when `size === "sm"`            |
| Array (OR)    | `{ size: ["sm", "md"] }`          | matches when `size` is `"sm"` or `"md"` |
| Negation      | `{ size: { not: "lg" } }`         | matches when `size !== "lg"`            |
| Negated array | `{ size: { not: ["sm", "md"] } }` | matches when `size` is not in the array |

Multiple conditions in one rule are combined with AND logic all must match.

```ts
.compound([
  // Applies only when variant is "solid" AND size is NOT "lg"
  { variant: "solid", size: { not: "lg" }, class: "ring-2 ring-blue-600" },
])
```

**Compound rules are applied in declaration order.** All matching rules apply there is no short-circuit.

**Returns:** `TvsBuilder` the same builder with compound rules registered.

---

## `cn(...args)`

A `clsx`-compatible class name helper.

```ts
import { cn } from "typed-variant-system";

cn("foo", condition && "bar", { baz: true, qux: false });
// → "foo bar baz"
```

**Accepted value types (`ClassValue`):**

| Type                           | Behavior                         |
| ------------------------------ | -------------------------------- |
| `string`                       | included as-is                   |
| `number`                       | coerced to string                |
| `boolean \| null \| undefined` | filtered out                     |
| `ClassValue[]`                 | flattened recursively            |
| `Record<string, unknown>`      | keys with truthy values included |
| `() => ClassValue`             | called, result recursed          |

---

## `createTvs(options?)`

Factory that returns a `{ tvs, cn }` pair configured with a custom class merge function.

```ts
import { createTvs } from "typed-variant-system";
import { twMerge } from "tailwind-merge";

export const { tvs, cn } = createTvs({ merge: twMerge });
```

**Options:**

| Option  | Type                            | Description                                                          |
| ------- | ------------------------------- | -------------------------------------------------------------------- |
| `merge` | `(classes: string[]) => string` | Custom merge function; receives an array of individual class strings |

When `merge` is provided, TVS collects all resolved classes into an array and passes them to your merge function instead of joining with spaces. This lets `tailwind-merge` (or any other merger) resolve conflicts across the full set of classes.

---

## `recipe(shape)`

Creates a reusable variant schema a pure description of variant keys and their allowed values, with no class strings attached.

```ts
import { recipe } from "typed-variant-system";

const sizeRecipe = recipe({
  size: ["sm", "md", "lg"] as const,
});
```

### `Recipe` methods

#### Calling a recipe as a function

A recipe is callable. Calling it with a base class string returns a constrained `TvsBuilder` — shorthand for `tvs(base, recipe)`.

```ts
const sizeRecipe = recipe({ size: ["sm", "md", "lg"] as const });

const sizedButton = sizeRecipe("inline-flex items-center").variants({
  size: { sm: "h-8", md: "h-10", lg: "h-12" },
});
```

#### `.and(other)`

Strict composition. Merges two recipes, producing a type error if any variant key conflicts.

```ts
const intentRecipe = recipe({ intent: ["primary", "danger"] as const });
const sizeRecipe = recipe({ size: ["sm", "lg"] as const });

const combined = intentRecipe.and(sizeRecipe);
// combined has both `intent` and `size` keys
```

#### `.merge(other)`

Soft composition. Like `.and()`, but unions conflicting variant values instead of erroring.

```ts
const base = recipe({ size: ["sm", "md"] as const });
const extend = recipe({ size: ["md", "lg"] as const });

const merged = base.merge(extend);
// merged.size allows "sm" | "md" | "lg"
```

#### `.variants(extra)`

Adds additional variant keys to the recipe shape without conflict checking.

```ts
const extended = sizeRecipe.variants({ tone: ["muted", "vibrant"] as const });
```

#### Calling a recipe as a function

A recipe can be used directly as the first argument to variant configuration (instead of calling `tvs`):

```ts
sizeRecipe("base-class").variants({ size: { sm: "h-8", md: "h-10", lg: "h-12" } });
```

This is equivalent to `tvs("base-class", sizeRecipe).variants(...)`.

---

## Types

### `VariantProps<T>`

Extracts variant prop types from a builder, excluding `class` and `className`.

```ts
type ButtonProps = VariantProps<typeof buttonVariants>;
```

### `InferProps<V, D>`

Full inferred props including `class` and `className`. Rarely needed directly prefer `VariantProps`.

### `ClassValue`

The union type accepted by `cn()` and the `class`/`className` props.

### `CompoundRule<V>`

A compound variant rule object. Keys are variant names with condition values; `class` holds the string to apply.

### `RecipeMap`

`Record<string, readonly string[]>` the shape of a recipe's variant schema.

### `VariantMap`

`Record<string, Record<string, string> | string>` the shape of a `.variants()` call.
