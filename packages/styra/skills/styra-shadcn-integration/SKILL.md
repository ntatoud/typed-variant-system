---
name: styra-shadcn-integration
description: >
  Integrate @ntatoud/styra into a shadcn/ui project — replaces class-variance-authority (CVA)
  and clsx+twMerge cn helper with a single createStyra({ merge: twMerge }) instance.
  Covers lib/styra.ts shared factory pattern, swapping cva/VariantProps imports, replacing
  cn from @/lib/utils, tailwind-merge deduplication via MergeFn, and removing clsx dependency.
  Preempts: per-component createStyra instances, double-merge with twMerge, keeping clsx after migration.
type: composition
library: "@ntatoud/styra"
library_version: "0.1.0"
requires:
  - styra-getting-started
sources:
  - "ntatoud/styra:packages/styra/src/index.ts"
  - "ntatoud/styra:packages/styra/README.md"
---

# Integrating @ntatoud/styra with shadcn/ui

This skill builds on styra-getting-started. Read it first for foundational concepts.

## 1. Integration Setup

Create a single shared `lib/styra.ts` file. Every component in the project imports from this file — never call `createStyra` more than once.

```ts
// lib/styra.ts
import { createStyra } from "@ntatoud/styra";
import { twMerge } from "tailwind-merge";

export const { styra, cn } = createStyra({ merge: twMerge });
export type { VariantProps } from "@ntatoud/styra";
```

Install `tailwind-merge` if not already present:

```sh
pnpm add tailwind-merge
```

After this, `clsx` and `class-variance-authority` can be removed:

```sh
pnpm remove class-variance-authority clsx
```

Delete (or empty out) `lib/utils.ts` if it only contained the old `cn` helper.

---

## 2. Core Integration Patterns

### Pattern 1 — Migrating a shadcn/ui component (Button)

Replace the CVA import and the `@/lib/utils` cn import. Pass `class` directly into the builder call — no outer `cn()` wrapper needed.

```ts
// components/ui/button.tsx — AFTER
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { styra, cn, type VariantProps } from "@/lib/styra"

const buttonVariants = styra("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50")
  .variants({
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    },
  })
  .defaults({ variant: "default", size: "default" })

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={buttonVariants({ variant, size, class: className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

Key change: `cn(buttonVariants({ variant, size, className }))` becomes `buttonVariants({ variant, size, class: className })`. The merge function configured in `createStyra` handles deduplication internally.

### Pattern 2 — Migrating a component that uses cn standalone

Some shadcn/ui components call `cn()` directly for conditional classes outside of a variant builder. Import `cn` from `@/lib/styra` — it is a full clsx-compatible helper that also runs `twMerge`.

```ts
// components/ui/badge.tsx — AFTER
import { styra, cn, type VariantProps } from "@/lib/styra"

const badgeVariants = styra("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold")
  .variants({
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      secondary: "border-transparent bg-secondary text-secondary-foreground",
      destructive: "border-transparent bg-destructive text-destructive-foreground",
      outline: "text-foreground",
    },
  })
  .defaults({ variant: "default" })

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, class: className })} {...props} />
  )
}

// cn is still available for ad-hoc conditional class merging elsewhere in the file
export function SomethingElse({ isActive }: { isActive: boolean }) {
  return <div className={cn("base-class", isActive && "active-class")} />
}

export { Badge, badgeVariants }
```

### Pattern 3 — Replacing lib/utils.ts cn across non-component files

Files that imported `cn` from `@/lib/utils` for layout or utility purposes update their import path only — the function signature is identical.

```ts
// BEFORE
import { cn } from "@/lib/utils";

// AFTER
import { cn } from "@/lib/styra";
```

No call-site changes are required. `cn` from styra accepts the same `ClassValue[]` spread that `clsx` accepts.

---

## 3. Common Mistakes

### [CRITICAL] Creating a new createStyra instance per component file

```ts
// WRONG — components/ui/button.tsx
import { createStyra } from "@ntatoud/styra"
import { twMerge } from "tailwind-merge"

const { styra, cn } = createStyra({ merge: twMerge }) // new instance every file

const buttonVariants = styra("...").variants({ ... })
```

```ts
// CORRECT — components/ui/button.tsx
import { styra, cn, type VariantProps } from "@/lib/styra" // shared instance

const buttonVariants = styra("...").variants({ ... })
```

Each `createStyra` call produces an isolated instance. Multiple instances are valid for isolated design systems but wasteful when one shared instance covers the entire project. Always import from the shared `lib/styra.ts`.

Source: `createStyra` in `packages/styra/src/index.ts`

---

### [CRITICAL] Double-merging with twMerge after the builder call

```ts
// WRONG — components/ui/button.tsx
import { twMerge } from "tailwind-merge"
import { styra, type VariantProps } from "@/lib/styra"

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size, class: className }))}
      //        ^^^^^^^^ twMerge already ran inside buttonVariants()
      {...props}
    />
  )
}
```

```ts
// CORRECT — components/ui/button.tsx
import { styra, type VariantProps } from "@/lib/styra"

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={buttonVariants({ variant, size, class: className })}
      {...props}
    />
  )
}
```

`createStyra({ merge: twMerge })` wires the merge function into every builder call. Wrapping the result in `twMerge()` again is redundant and can produce unexpected output for complex Tailwind class conflicts.

Source: `MergeFn` wiring in `packages/styra/src/index.ts`

---

### [MODERATE] Keeping clsx as a dependency after migration

```ts
// WRONG — some-file.ts
import { clsx } from "clsx"; // redundant after migration
import { cn } from "@/lib/styra";

const classes = cn(clsx(["a", condition && "b"]), "c");
//                 ^^^^ unnecessary double-wrap
```

```ts
// CORRECT — some-file.ts
import { cn } from "@/lib/styra";

const classes = cn("a", condition && "b", "c");
```

`cn` from a `createStyra` instance is a drop-in replacement for `clsx` with the merge function applied on top. Remove `clsx` from `package.json` after migrating all import sites.

Source: `cn` implementation in `packages/styra/src/index.ts`
