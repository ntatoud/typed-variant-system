import { cva } from "cva";
import { styra } from "@ntatoud/styra";

// ─── Setup ────────────────────────────────────────────────────────────────────

// Scenario 1: base class only
const cvaBase = cva({ base: "btn" });
const styraBase = styra("btn");

// Scenario 2: variants
const cvaVariants = cva({
  base: "btn",
  variants: {
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
    disabled: { yes: "opacity-50", no: "" },
  },
  defaultVariants: { size: "md" },
});

const styraVariants = styra("btn")
  .variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
    disabled: { yes: "opacity-50", no: "" },
  })
  .defaults({ size: "md" });

// Scenario 3: compound variants
const cvaCompound = cva({
  base: "btn",
  variants: {
    size: { sm: "text-sm", md: "text-md" },
    color: { red: "bg-red", blue: "bg-blue" },
  },
  compoundVariants: [
    { size: "sm", color: "red", class: "ring-red" },
    { size: "md", color: "blue", class: "ring-blue" },
  ],
});

const styraCompound = styra("btn")
  .variants({
    size: { sm: "text-sm", md: "text-md" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .compound([
    { size: "sm", color: "red", class: "ring-red" },
    { size: "md", color: "blue", class: "ring-blue" },
  ]);

// ─── Benchmark ────────────────────────────────────────────────────────────────
// Calls are batched (N per sample) so that per-call measurement overhead
// doesn't dominate results for sub-100ns operations.

const BATCH = 10_000;

function bench(label: string, fn: () => void, iterations = 200): number {
  // warmup
  for (let i = 0; i < BATCH * 5; i++) fn();

  const times: number[] = [];
  for (let iter = 0; iter < iterations; iter++) {
    const t0 = performance.now();
    for (let i = 0; i < BATCH; i++) fn();
    times.push((performance.now() - t0) / BATCH);
  }

  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length * 0.5)]!;
  const p99 = times[Math.floor(times.length * 0.99)]!;
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const opsM = (1 / avg / 1e6) * 1e3;

  process.stdout.write(
    `  ${label.padEnd(8)} avg=${(avg * 1e6).toFixed(1).padStart(6)}ns  p50=${(p50 * 1e6).toFixed(1).padStart(6)}ns  p99=${(p99 * 1e6).toFixed(1).padStart(6)}ns  ${opsM.toFixed(1).padStart(5)} M ops/s\n`,
  );

  return avg;
}

function compare(title: string, cvaFn: () => void, styraFn: () => void) {
  console.log(`\n── ${title} ──`);
  const cvaAvg = bench("cva", cvaFn);
  const styraAvg = bench("styra", styraFn);
  const ratio = cvaAvg / styraAvg;
  console.log(
    `  → styra is ${ratio >= 1 ? ratio.toFixed(2) + "x faster" : (1 / ratio).toFixed(2) + "x slower"} than cva`,
  );
}

compare(
  "1. base class only",
  () => cvaBase(),
  () => styraBase({}),
);
compare(
  "2. variants (with default)",
  () => cvaVariants({ color: "red", disabled: "yes" }),
  () => styraVariants({ color: "red", disabled: "yes" }),
);
compare(
  "3. compound variants",
  () => cvaCompound({ size: "sm", color: "red" }),
  () => styraCompound({ size: "sm", color: "red" }),
);
