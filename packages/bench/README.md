# bench

Micro-benchmark comparing `styra` vs `cva@1.0.0-beta.4` across three scenarios: base class only, variants with defaults, and compound variants.

## Methodology

Each scenario runs 10,000 calls per sample over 200 iterations (after a warmup pass). Reports avg, p50, p99 latency in nanoseconds and throughput in M ops/s.

## Running

```bash
vp exec tsx src/index.ts
```

## Scenarios

1. **Base class only** — `styra("btn")` vs `cva({ base: "btn" })()`
2. **Variants with defaults** — size/color/disabled variants, `size` defaulted to `"md"`
3. **Compound variants** — two compound rules on size + color
