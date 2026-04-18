# Examples

## Button Component

A button with intent, size, and a boolean loading variant, using compound variants to apply a focus ring only on the solid variant.

```ts
import { tvs, cn } from "@/lib/tvs";
import type { VariantProps } from "typed-variant-system";

const buttonVariants = tvs("inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none")
  .variants({
    variant: {
      solid:   "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
      ghost:   "text-blue-600 hover:bg-blue-50",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-5 text-lg",
    },
    loading: "opacity-75 cursor-wait pointer-events-none",
  })
  .defaults({ variant: "solid", size: "md", loading: false })
  .compound([
    { variant: "solid", class: "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2" },
  ]);

type ButtonProps = VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ variant, size, loading, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, loading, className })}
      {...props}
    />
  );
}
```

Usage:

```tsx
<Button>Default</Button>
<Button variant="outline" size="sm">Small outline</Button>
<Button loading>Saving…</Button>
```

---

## Badge with Boolean Variant

```ts
const badgeVariants = tvs("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium")
  .variants({
    color: {
      gray: "bg-gray-100 text-gray-800",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
    },
    dot: "gap-1.5",
  })
  .defaults({ color: "gray", dot: false });
```

```tsx
<Badge color="green" dot>
  Active
</Badge>
```

---

## Input with Shared Recipe

```ts
// lib/recipes.ts
import { recipe } from "typed-variant-system";
export const sizeRecipe = recipe({ size: ["sm", "default", "lg"] as const });
```

```ts
// components/ui/input.tsx
import { tvs } from "@/lib/tvs";
import { sizeRecipe } from "@/lib/recipes";

const inputVariants = tvs(
  "flex w-full rounded border border-gray-300 bg-white shadow-sm transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
  sizeRecipe,
)
  .variants({
    size: {
      sm: "h-7 px-2 text-sm",
      default: "h-9 px-3 text-base",
      lg: "h-11 px-4 text-lg",
    },
    invalid: "border-red-500 focus-visible:ring-red-500",
  })
  .defaults({ size: "default", invalid: false });
```

---

## Compound Variants: Responsive Ring

Apply a visual affordance only when a specific combination is active:

```ts
const cardVariants = tvs("rounded-lg border bg-white")
  .variants({
    interactive: "cursor-pointer transition-shadow",
    selected: "ring-2 ring-blue-600",
    size: { sm: "p-3", md: "p-5", lg: "p-7" },
  })
  .defaults({ interactive: false, selected: false, size: "md" })
  .compound([
    // Larger shadow only when interactive AND not selected
    { interactive: true, selected: false, class: "hover:shadow-md" },
    // Thicker ring when selected AND large
    { selected: true, size: "lg", class: "ring-4" },
  ]);
```

---

## Negation in Compound Variants

```ts
const alertVariants = tvs("rounded border p-4 text-sm")
  .variants({
    type: {
      info: "border-blue-200 bg-blue-50 text-blue-800",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
      error: "border-red-200 bg-red-50 text-red-800",
    },
    dismissible: "pr-10",
  })
  .defaults({ dismissible: false })
  .compound([
    // Add bold title treatment for everything except `info`
    { type: { not: "info" }, class: "font-semibold" },
    // Extra border width for non-info types when dismissible
    { type: { not: "info" }, dismissible: true, class: "border-2" },
  ]);
```

---

## Custom Merge Function for Tailwind

When components accept a `className` prop from callers, Tailwind utility conflicts can arise. Configure TVS once with `tailwind-merge`:

```ts
// lib/tvs.ts
import { createTvs } from "typed-variant-system";
import { twMerge } from "tailwind-merge";

export const { tvs, cn } = createTvs({ merge: twMerge });
```

Now callers can safely override classes:

```tsx
// Caller overrides the default padding no duplicate `px-*` in the output
<Button className="px-8">Wide button</Button>
```

---

## `cn` Helper for Conditional Classes

```tsx
function Label({ required, disabled, className }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-gray-700",
        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    />
  );
}
```

---

## Forwarding `className` from React Props

TVS accepts both `class` and `className` props. In React components you typically forward `className`:

```ts
const card = tvs("rounded-lg bg-white shadow").variants({ padding: { none: "", md: "p-4", lg: "p-6" } });

function Card({ padding, className, children }: VariantProps<typeof card> & { children: React.ReactNode; className?: string }) {
  return <div className={card({ padding, className })}>{children}</div>;
}
```

The `className` from your component props is forwarded directly into the builder, so consumers can extend or override styles naturally.

---

## `className` as a Function

The `className` prop also accepts a zero-argument function that returns a `ClassValue`. This is useful for render-prop patterns where the class string is computed lazily:

```ts
button({
  variant: "solid",
  className: () => (isActive ? "ring-2 ring-offset-2" : null),
});
```
