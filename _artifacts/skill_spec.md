# Skill Spec — @ntatoud/styra

Generated from domain discovery on 2026-04-12.

---

## Skill 1 — getting-started

**Domain:** building-variants  
**Trigger:** Developer is installing styra for the first time, creating their first variant builder, or setting up createStyra with tailwind-merge.

**Developer moment:** "I just installed styra — show me the full setup from import to first working component."

**Must cover:**

- Install: `npm install @ntatoud/styra` / `pnpm add @ntatoud/styra` / `yarn add @ntatoud/styra`
- Basic usage: `styra(base).variants({...}).defaults({...})(props)` → string
- The `class` and `className` override props (both accepted, both support clsx syntax)
- Setting up `createStyra({ merge: twMerge })` for Tailwind projects
- Exporting the `cn` utility alongside variants
- The `VariantProps<typeof builder>` type helper for component prop types

**Failure modes to preempt:**

- Calling `.variants()` twice on the same builder (throws at runtime)
- Wiring twMerge outside the factory: `twMerge(styra(...)(...))` — should be `createStyra({ merge: twMerge })`

**Key exports:** `styra`, `createStyra`, `cn`, `VariantProps`

---

## Skill 2 — define-variants

**Domain:** building-variants  
**Trigger:** Developer is defining variant keys, boolean flags, or defaults for a component.

**Developer moment:** "I'm building a Button component and need size, color, and a disabled flag as variants."

**Must cover:**

- Standard variant map: `{ size: { sm: "...", md: "..." } }`
- Boolean shorthand: pass a plain string → prop becomes `boolean` → applied when `true`
- `.defaults()` — makes variants optional; required variants without defaults produce TypeScript errors
- `VariantProps<T>` — strips `class`/`className`, respects optional/required distinction
- clsx-like `class`/`className` props: string, array, object map, or function

**Failure modes to preempt:**

- Omitting a required variant (no default) silently resolves to no class at runtime
- Using boolean shorthand and then passing `{ disabled: { not: true } }` in a compound rule — the string key is `"true"`, not the boolean
- Agents over-engineering with explicit `{ true: "...", false: "" }` when boolean shorthand is cleaner

**Key exports:** `styra`, `VariantProps`, `InferProps`, `ClassValue`

---

## Skill 3 — compound-variants

**Domain:** compound-variants  
**Trigger:** Developer needs to apply a class only when multiple variants are simultaneously active, or wants to exclude a case with negation.

**Developer moment:** "I want `ring-red` only when size is sm AND color is red. And I want `hover:opacity-80` on everything EXCEPT when disabled is true."

**Must cover:**

- `.compound([{ variantKey: value, ..., class: "..." }])` syntax
- All conditions in a rule must match for the class to apply
- Negation: `{ variantKey: { not: value }, class: "..." }` — applies when the variant is NOT that value
- Multiple rules fire independently — all matching rules apply
- Boolean shorthand with compound: negate with `{ disabled: { not: "true" } }` (string key)

**Failure modes to preempt:**

- Over-engineering with compound rules when a default or boolean variant is simpler
- Forgetting the `class` key in a compound rule (TypeScript catches it; runtime silently skips)
- Writing `{ disabled: { not: true } }` instead of `{ disabled: { not: "true" } }` for boolean shorthand variants
- CVA users writing `compoundVariants: [...]` — styra uses `.compound([...])`

**Key exports:** `CompoundRule`, `Not`

---

## Skill 4 — migrate-from-cva

**Domain:** migration  
**Trigger:** Developer has CVA code and wants to replace it with styra.

**Developer moment:** "I have a project using cva() everywhere — show me how to replace it with styra with minimal changes."

**Must cover:**

- API mapping table:
  - `cva(base, { variants })` → `styra(base).variants({})`
  - `cva(base, { defaultVariants })` → `.defaults({})`
  - `cva(base, { compoundVariants })` → `.compound([])`
  - `cx(...)` → `cn(...)`
  - `VariantProps<typeof fn>` → identical, same import pattern
- `createStyra({ merge })` replaces `import { cva } from 'cva'` with merge config
- No config object — styra uses a builder chain
- New capabilities not in CVA: boolean shorthand, negation in compound rules

**Failure modes to preempt:**

- Agents generating `cva()` config object syntax instead of builder chain
- Keeping `compoundVariants` array key instead of calling `.compound()`
- Keeping `defaultVariants` object key instead of calling `.defaults()`

**Key exports:** `styra`, `cn`, `createStyra`, `VariantProps`

---

## Skill 5 — shadcn-integration

**Domain:** integration  
**Trigger:** Developer is using shadcn/ui and wants to replace CVA with styra, or is setting up styra in a Tailwind + shadcn project.

**Developer moment:** "I'm using shadcn/ui which uses CVA internally — how do I swap it out for styra?"

**Must cover:**

- Create a shared `lib/styra.ts` that exports `styra` and `cn` from `createStyra({ merge: twMerge })`
- Replace `import { cva, type VariantProps } from 'class-variance-authority'` with the local file
- Replace `import { cn } from '@/lib/utils'` (clsx + twMerge) with `cn` from the shared styra instance
- The merge fn receives individual class strings — `twMerge` handles deduplication correctly
- Single shared `createStyra` instance across the project

**Failure modes to preempt:**

- Creating a new `createStyra` instance per component file instead of one shared instance
- Passing `twMerge` to both `createStyra` and calling it again on the result (double-merge)
- Keeping `clsx` as a separate dependency after migrating — `cn` from styra replaces it

**Key exports:** `createStyra`, `cn`, `styra`, `VariantProps`
