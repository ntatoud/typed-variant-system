# Edge Cases

## `.variants()` Can Only Be Called Once

Calling `.variants()` more than once on the same builder throws a runtime error:

```ts
const b = tvs("base").variants({ size: { sm: "...", lg: "..." } });
b.variants({ tone: { muted: "..." } }); // throws: "tvs: .variants() can only be called once per builder"
```

To add more variants, provide all of them in a single `.variants()` call, or compose using recipes.

---

## Boolean Shorthand Defaults

When a boolean shorthand variant has a default, the default value `false` means "apply no class by default", and `true` means "apply the class by default":

```ts
const el = tvs("base").variants({ loading: "opacity-50" }).defaults({ loading: false });

el({}); // → "base"           (default false, no class applied)
el({ loading: true }); // → "base opacity-50"
```

```ts
const el2 = tvs("base").variants({ loading: "opacity-50" }).defaults({ loading: true });

el2({}); // → "base opacity-50" (default true, class applied)
el2({ loading: false }); // → "base"
```

---

## Defaults Do Not Override Explicit `false`

A default is only applied when the prop is `undefined`. Passing `false` explicitly overrides any default, including a default of `true`:

```ts
const el = tvs("base").variants({ bold: "font-bold" }).defaults({ bold: true });

el({}); // → "base font-bold"   (default applied)
el({ bold: false }); // → "base"             (explicit false wins)
```

---

## All Matching Compound Rules Apply

There is no short-circuit in compound rule evaluation. Every rule whose conditions all match will have its `class` string appended, in declaration order:

```ts
const el = tvs("base")
  .variants({ size: { sm: "h-8", lg: "h-12" }, variant: { solid: "bg-blue-600" } })
  .compound([
    { size: "sm", class: "text-sm" },
    { variant: "solid", class: "text-white" },
    { size: "sm", variant: "solid", class: "shadow" },
  ]);

el({ size: "sm", variant: "solid" });
// → "base h-8 bg-blue-600 text-sm text-white shadow"
// All three rules matched and all three classes were applied.
```

---

## `class` and `className` Both Apply

Both `class` and `className` are accepted and both are appended to the resolved class string. When both are provided, `class` comes before `className`:

```ts
const el = tvs("base").variants({ size: { sm: "h-8" } });

el({ size: "sm", class: "mt-2", className: "mb-2" });
// → "base h-8 mt-2 mb-2"
```

---

## Variant Application Order

Variant classes are applied in the order the keys are defined in `.variants()`, regardless of the order props are passed at the call site:

```ts
const el = tvs("base").variants({
  a: { x: "A-X", y: "A-Y" },
  b: { x: "B-X", y: "B-Y" },
});

el({ b: "x", a: "y" }); // → "base A-Y B-X"  (a before b, per definition order)
```

---

## `undefined` and `null` Props Are Ignored

Passing `undefined` or `null` for a variant prop (including explicitly) skips that variant entirely. No class is applied, and the default (if set) is not used for `null` only for `undefined`.

```ts
const el = tvs("base")
  .variants({ size: { sm: "h-8", lg: "h-12" } })
  .defaults({ size: "sm" });

el({ size: undefined }); // → "base h-8"  (undefined uses default)
el({ size: null as any }); // → "base"    (null skips variant, no default)
```

> **Note:** Passing `null` is not part of the intended API. Rely on `undefined` (i.e. omitting the prop) to trigger defaults.

---

## Recipe Conflict Detection Is Compile-Time Only

Recipe conflict detection via `.and()` happens at the TypeScript level. At runtime, `.and()` simply merges the two recipe maps. If you bypass TypeScript (e.g. with `as any`), no runtime error is thrown.

---

## Recipe Callable Locks Variant Additions

Once you call a recipe as a function to get a builder, the returned builder cannot add new variant keys beyond those in the recipe schema. The TypeScript types enforce this:

```ts
const sized = sizeRecipe("").variants({ size: { sm: "h-8", lg: "h-12" } });
sized.variants({ tone: { muted: "..." } }); // TS error: variants() is not available
```

If you need additional variants, extend the recipe shape first with `.variants()` before calling it:

```ts
const extended = sizeRecipe.variants({ tone: ["muted", "vibrant"] as const });
const builder = extended("").variants({
  size: { sm: "h-8", lg: "h-12" },
  tone: { muted: "text-gray-500", vibrant: "text-blue-600" },
});
```

---

## Boolean Values in Compound Conditions

When writing compound rules for boolean shorthand variants, use `true` and `false` (JavaScript booleans), not the strings `"true"` or `"false"`:

```ts
const el = tvs("base")
  .variants({ active: "ring-2", size: { sm: "h-8", lg: "h-12" } })
  .compound([
    { active: true, size: "lg", class: "ring-4" }, // correct
  ]);
```

Internally TVS coerces booleans to their string keys, so using string literals `"true"` / `"false"` in compound conditions would be incorrect.

---

## Custom Merge Receives Individual Strings

When using `createTvs({ merge })`, the merge function receives an array of **individual** class strings (one entry per class token), not a pre-joined string. This is the correct input format for `tailwind-merge` and similar tools:

```ts
const { tvs } = createTvs({
  merge: (classes) => {
    console.log(classes); // ["base", "h-8", "bg-blue-600", ...]
    return classes.join(" ");
  },
});
```

---

## `cn` Handles Nested Arrays and Objects

`cn` resolves recursively, so arbitrarily nested arrays and object maps all work:

```ts
cn(["foo", ["bar", "baz"]], { qux: true, quux: false }, false, null, undefined, 0);
// → "foo bar baz qux"
```

Zero (`0`) is coerced to the string `"0"` and included. All other falsy values are excluded.
