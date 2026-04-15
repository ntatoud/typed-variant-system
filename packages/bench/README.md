# bench

Micro-benchmark comparing `typed-variant-system` vs `cva@1.0.0-beta.4` and `recipe` vs `typed-variant-system` across multiple scenarios.

## Methodology

Each scenario runs 10,000 calls per sample over 200 iterations (after a warmup pass). Reports avg, p50, p99 latency in nanoseconds and throughput in M ops/s.

## Running

```bash
vp exec tsx src/index.ts
```

## Scenarios

### tvs vs cva

1. **Base class only** — `tvs("btn")` vs `cva({ base: "btn" })()`
2. **Variants with defaults** — size/color/disabled variants, `size` defaulted to `"md"`
3. **Compound variants** — two compound rules on size + color
4. **class: string** — string class override
5. **class: array** — array class value
6. **class: object** — conditional object class value
7. **class: nested array+object** — deeply nested clsx-like value
8. **cn: strings** — `cn()` utility with plain strings
9. **cn: array+obj** — `cn()` utility with array + object

### recipe vs tvs

Compares a recipe-built builder (via `createRecipe().implement()`) against an equivalent `typed-variant-system` builder with the same variant structure. Measures call-time overhead — recipe builders are stamped once at module load, so the comparison is fair.

10. **recipe: variants only** — no base class, size + color variants
11. **recipe: variants + defaults** — size/color/disabled with a default
12. **recipe: compound variants** — two compound rules
13. **recipe: extended (3 recipes)** — three `.extend()` calls before `.implement()`

## CI

The benchmark runs automatically on pull requests that touch `packages/typed-variant-system/src/` or `packages/bench/src/`, and posts results as a PR comment.
