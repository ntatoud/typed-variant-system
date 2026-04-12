# Styra — Improvement Ideas

## 1. Export a `VariantProps` type helper

`Parameters<typeof fn>[0]` is verbose and leaks `class`/`className` into component prop intersections. A dedicated helper would be cleaner:

```ts
type VariantProps<T> = T extends (props: infer P) => string
  ? Omit<P, "class" | "className">
  : never;
```

Usage: `VariantProps<typeof buttonVariants>` — readable, strips internal props, drop-in for CVA users.

## 2. Boolean variant shorthand

Common pattern today:

```ts
styra("base").variants({ disabled: { true: "opacity-50", false: "" } });
```

Could accept a string directly for boolean variants:

```ts
styra("base").variants({ disabled: "opacity-50 pointer-events-none" });
```

Applied when the prop is `true`, skipped when `false`/`undefined`. Covers `isActive`, `disabled`, `open`, etc.

## 3. `.extend()` for variant inheritance

Useful when a child component wraps a parent but overrides some variants (e.g. `InputGroupButton` wrapping `Button` with different `size` values):

```ts
const inputGroupButtonVariants = buttonVariants.extend({
  size: { xs: "...", sm: "..." }, // override size, inherit everything else
});
```

Avoids recreating builders from scratch and keeps the parent link explicit.

## 4. Multi-slot support

Components like `Card`, `Sidebar`, `Dialog` have 5-10 sub-elements each with their own classes. A slots API would co-locate them:

```ts
const card = styra.slots({
  root: "rounded-xl border bg-card",
  header: "flex flex-col gap-1.5 p-6",
  title: "font-semibold leading-none",
  description: "text-sm text-muted-foreground",
  content: "p-6 pt-0",
  footer: "flex items-center p-6 pt-0",
});

// card.root({ className }) / card.title({ className }) / ...
```

Variants could apply across slots (e.g. `size: "sm"` changes padding in both `header` and `content`). Bigger lift, but fills a real gap in the Tailwind ecosystem.

## 5. Responsive variants

Apply a variant conditionally per breakpoint:

```tsx
<Button size={{ default: "sm", md: "default", lg: "lg" }} />
```

Requires generating Tailwind `md:...` / `lg:...` class prefixes at call time. Ambitious but addresses a real pain point — today you either duplicate markup or use media-query CSS.
