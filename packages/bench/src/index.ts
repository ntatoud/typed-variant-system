import { cva } from "cva";
import { cn, tvs } from "tvs";

// ─── Setup ────────────────────────────────────────────────────────────────────

// Scenario 1: base class only
const cvaBase = cva({ base: "btn" });
const tvsBase = tvs("btn");

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

const tvsVariants = tvs("btn")
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

const tvsCompound = tvs("btn")
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

function compare(title: string, cvaFn: () => void, tvsFn: () => void) {
  console.log(`\n── ${title} ──`);
  const cvaAvg = bench("cva", cvaFn);
  const tvsAvg = bench("tvs", tvsFn);
  const ratio = cvaAvg / tvsAvg;
  console.log(
    `  → tvs is ${ratio >= 1 ? ratio.toFixed(2) + "x faster" : (1 / ratio).toFixed(2) + "x slower"} than cva`,
  );
}

compare(
  "1. base class only",
  () => cvaBase(),
  () => tvsBase({}),
);
compare(
  "2. variants (with default)",
  () => cvaVariants({ color: "red", disabled: "yes" }),
  () => tvsVariants({ color: "red", disabled: "yes" }),
);
compare(
  "3. compound variants",
  () => cvaCompound({ size: "sm", color: "red" }),
  () => tvsCompound({ size: "sm", color: "red" }),
);

// ─── clsx-like syntax scenarios ───────────────────────────────────────────────

const cvaWithClass = cva({ base: "btn", variants: { size: { sm: "text-sm", md: "text-md" } } });

// Scenario 4: string class override (baseline — already existed, now explicit comparison)
compare(
  "4. class: string",
  () => cvaWithClass({ size: "sm", class: "mt-4" }),
  () => tvsVariants({ size: "sm", color: "red", disabled: "no", class: "mt-4" }),
);

// Scenario 5: class as array
compare(
  "5. class: array",
  () => cvaWithClass({ size: "sm", class: "mt-4 px-2" }),
  () => tvsBase({ class: ["mt-4", "px-2"] }),
);

// Scenario 6: class as object (conditional classes)
compare(
  "6. class: object",
  () => cvaWithClass({ size: "sm", class: "mt-4" }),
  () => tvsBase({ class: { "mt-4": true, "px-2": false, "font-bold": true } }),
);

// Scenario 7: class as nested array + object mix
compare(
  "7. class: nested array+object",
  () => cvaWithClass({ size: "sm", class: "mt-4 px-2 font-bold" }),
  () => tvsBase({ class: ["mt-4", ["px-2", { "font-bold": true, italic: false }]] }),
);

// Scenario 8: cn utility — strings
compare(
  "8. cn: strings",
  () => ["btn", "mt-4", "px-2"].join(" "),
  () => cn("btn", "mt-4", "px-2"),
);

// Scenario 9: cn utility — array + object
compare(
  "9. cn: array+obj",
  () => ["btn", "mt-4", "font-bold"].join(" "),
  () => cn(["btn", "mt-4", { "font-bold": true, italic: false }]),
);
