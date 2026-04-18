# Getting Started

## Installation

```sh
npm install typed-variant-system
```

## Basic Usage

```ts
import { tvs } from "typed-variant-system";

const button = tvs("inline-flex items-center rounded")
  .variants({
    variant: {
      solid: "bg-blue-600 text-white",
      outline: "border border-blue-600 text-blue-600",
      ghost: "text-blue-600",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    },
  })
  .defaults({ size: "md" });

// TypeScript knows `variant` is required, `size` is optional
button({ variant: "solid" }); // → "inline-flex ... bg-blue-600 text-white h-10 px-4 text-base"
button({ variant: "outline", size: "sm" }); // → "inline-flex ... border ... h-8 px-3 text-sm"
```

## Setup with Tailwind Merge

For Tailwind CSS projects, configure TVS once using `createTvs` to resolve class conflicts automatically:

```ts
// lib/tvs.ts
import { createTvs } from "typed-variant-system";
import { twMerge } from "tailwind-merge";

export const { tvs, cn } = createTvs({ merge: twMerge });
```

Import `tvs` and `cn` from your local file instead of the package:

```ts
import { tvs, cn } from "@/lib/tvs";
```

## Extracting Variant Props

Use the `VariantProps` utility type to extract the call-site prop types from a builder:

```ts
import { VariantProps } from "typed-variant-system";

const badge = tvs("rounded-full px-2 py-0.5")
  .variants({ color: { blue: "bg-blue-100 text-blue-800", red: "bg-red-100 text-red-800" } });

type BadgeProps = VariantProps<typeof badge>;
// → { color: "blue" | "red" }

function Badge({ color, className }: BadgeProps & { className?: string }) {
  return <span className={badge({ color, className })} />;
}
```
