import { clsx } from "clsx";
import { cva } from "cva";
import { twMerge } from "tailwind-merge";
import { cn, tvs } from "typed-variant-system";
import { createTvs } from "typed-variant-system";
import { recipe } from "typed-variant-system/recipe";

const { cn: cnTw } = createTvs({ merge: twMerge });

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

function compare(title: string, aFn: () => void, bFn: () => void, aLabel = "cva", bLabel = "tvs") {
  console.log(`\n── ${title} ──`);
  const aAvg = bench(aLabel, aFn);
  const bAvg = bench(bLabel, bFn);
  const ratio = aAvg / bAvg;
  console.log(
    `  → ${bLabel} is ${ratio >= 1 ? ratio.toFixed(2) + "x faster" : (1 / ratio).toFixed(2) + "x slower"} than ${aLabel}`,
  );
}

function compareRecipe(title: string, tvsFn: () => void, recipeFn: () => void) {
  console.log(`\n── ${title} ──`);
  const tvsAvg = bench("tvs", tvsFn);
  const recipeAvg = bench("recipe", recipeFn);
  const ratio = tvsAvg / recipeAvg;
  console.log(
    `  → recipe is ${ratio >= 1 ? ratio.toFixed(2) + "x faster" : (1 / ratio).toFixed(2) + "x slower"} than tvs`,
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
  () => clsx("btn", "mt-4", "px-2"),
  () => cn("btn", "mt-4", "px-2"),
  "clsx",
  "cn",
);

// Scenario 9: cn utility — array + object
compare(
  "9. cn: array+obj",
  () => clsx(["btn", "mt-4", { "font-bold": true, italic: false }]),
  () => cn(["btn", "mt-4", { "font-bold": true, italic: false }]),
  "clsx",
  "cn",
);

// ─── cn with twMerge (createTvs) ──────────────────────────────────────────────

// Scenario 10: cnTw vs twMerge — strings
compare(
  "10. cnTw: strings",
  () => twMerge("btn", "mt-4", "px-2"),
  () => cnTw("btn", "mt-4", "px-2"),
  "twMerge",
  "cnTw",
);

// Scenario 11: cnTw vs twMerge — array + object
compare(
  "11. cnTw: array+obj",
  () => twMerge(clsx(["btn", "mt-4", { "font-bold": true, italic: false }])),
  () => cnTw(["btn", "mt-4", { "font-bold": true, italic: false }]),
  "twMerge+clsx",
  "cnTw",
);

// ─── Recipe vs tvs ────────────────────────────────────────────────────────────
// Each scenario compares a recipe-built builder against an equivalent tvs builder
// with the same variant structure and defaults.

// Scenario 12: recipe — variants only (no base class)
const tvsVariantsOnly = tvs("").variants({
  size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
  color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
});

const recipeVariantsOnly = recipe({
  size: ["sm", "md", "lg"],
  color: ["red", "blue", "green"],
}).implement({
  size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
  color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
});

compareRecipe(
  "12. recipe: variants only",
  () => tvsVariantsOnly({ size: "sm", color: "red" }),
  () => recipeVariantsOnly({ size: "sm", color: "red" }),
);

// Scenario 13: recipe — variants + defaults
const tvsWithDefaults = tvs("")
  .variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
    disabled: { yes: "opacity-50", no: "" },
  })
  .defaults({ size: "md" });

const recipeWithDefaults = recipe({
  size: ["sm", "md", "lg"],
  color: ["red", "blue", "green"],
  disabled: ["yes", "no"],
})
  .implement({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
    disabled: { yes: "opacity-50", no: "" },
  })
  .defaults({ size: "md" });

compareRecipe(
  "13. recipe: variants + defaults",
  () => tvsWithDefaults({ color: "red", disabled: "yes" }),
  () => recipeWithDefaults({ color: "red", disabled: "yes" }),
);

// Scenario 14: recipe — variants + compound rules
const tvsWithCompound = tvs("")
  .variants({
    size: { sm: "text-sm", md: "text-md" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .compound([
    { size: "sm", color: "red", class: "ring-red" },
    { size: "md", color: "blue", class: "ring-blue" },
  ]);

const recipeWithCompound = recipe({ size: ["sm", "md"], color: ["red", "blue"] })
  .implement({
    size: { sm: "text-sm", md: "text-md" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .compound([
    { size: "sm", color: "red", class: "ring-red" },
    { size: "md", color: "blue", class: "ring-blue" },
  ]);

compareRecipe(
  "14. recipe: compound variants",
  () => tvsWithCompound({ size: "sm", color: "red" }),
  () => recipeWithCompound({ size: "sm", color: "red" }),
);

// Scenario 15: recipe — extended (two recipes fused)
const tvsExtended = tvs("").variants({
  size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
  color: { red: "bg-red", blue: "bg-blue" },
  disabled: { yes: "opacity-50", no: "" },
});

const recipeExtended = recipe({ size: ["sm", "md", "lg"] })
  .and(recipe({ color: ["red", "blue"] }))
  .and(recipe({ disabled: ["yes", "no"] }))
  .implement({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue" },
    disabled: { yes: "opacity-50", no: "" },
  });

compareRecipe(
  "15. recipe: extended (3 recipes)",
  () => tvsExtended({ size: "sm", color: "red", disabled: "no" }),
  () => recipeExtended({ size: "sm", color: "red", disabled: "no" }),
);
