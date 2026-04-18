/**
 * Internal overhead benchmarks.
 *
 * Verifies that tvs abstractions (recipe, createTvs) add no measurable
 * call-time cost compared to a plain tvs builder with the same variant
 * structure. All overhead is paid at build time, not call time.
 */

import { createTvs } from "typed-variant-system/config";
import { tvs } from "typed-variant-system";
import { recipe } from "typed-variant-system/recipe";
import { bench, compare } from "./bench.js";

// ─── recipe vs tvs ────────────────────────────────────────────────────────────

const tvsVariantsOnly = tvs("").variants({
  size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
  color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
});

const recipeVariantsOnly = recipe({
  size: ["sm", "md", "lg"],
  color: ["red", "blue", "green"],
})("").variants({
  size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
  color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
});

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
})("")
  .variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue", green: "bg-green" },
    disabled: { yes: "opacity-50", no: "" },
  })
  .defaults({ size: "md" });

const tvsWithCompound = tvs("")
  .variants({
    size: { sm: "text-sm", md: "text-md" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .compound([
    { size: "sm", color: "red", class: "ring-red" },
    { size: "md", color: "blue", class: "ring-blue" },
  ]);

const recipeWithCompound = recipe({ size: ["sm", "md"], color: ["red", "blue"] })("")
  .variants({
    size: { sm: "text-sm", md: "text-md" },
    color: { red: "bg-red", blue: "bg-blue" },
  })
  .compound([
    { size: "sm", color: "red", class: "ring-red" },
    { size: "md", color: "blue", class: "ring-blue" },
  ]);

const tvsExtended = tvs("").variants({
  size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
  color: { red: "bg-red", blue: "bg-blue" },
  disabled: { yes: "opacity-50", no: "" },
});

const recipeExtended = recipe({ size: ["sm", "md", "lg"] })
  .and(recipe({ color: ["red", "blue"] }))
  .and(recipe({ disabled: ["yes", "no"] }))("")
  .variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue" },
    disabled: { yes: "opacity-50", no: "" },
  });

// ─── createTvs (no merge) vs tvs ─────────────────────────────────────────────

const { tvs: tvsConfigured } = createTvs();

const plainBuilder = tvs("btn").variants({
  size: { sm: "text-sm", md: "text-md" },
  color: { red: "bg-red", blue: "bg-blue" },
});

const configuredBuilder = tvsConfigured("btn").variants({
  size: { sm: "text-sm", md: "text-md" },
  color: { red: "bg-red", blue: "bg-blue" },
});

export function runInternals() {
  console.log("\n\n━━━ internal overhead ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  (expected: ~1.0x — abstractions cost nothing at call time)");

  console.log("\n── recipe vs tvs ──");
  compare(
    "1. variants only",
    () => tvsVariantsOnly({ size: "sm", color: "red" }),
    () => recipeVariantsOnly({ size: "sm", color: "red" }),
    "tvs",
    "recipe",
  );
  compare(
    "2. variants + defaults",
    () => tvsWithDefaults({ color: "red", disabled: "yes" }),
    () => recipeWithDefaults({ color: "red", disabled: "yes" }),
    "tvs",
    "recipe",
  );
  compare(
    "3. compound variants",
    () => tvsWithCompound({ size: "sm", color: "red" }),
    () => recipeWithCompound({ size: "sm", color: "red" }),
    "tvs",
    "recipe",
  );
  compare(
    "4. extended (3 recipes)",
    () => tvsExtended({ size: "sm", color: "red", disabled: "no" }),
    () => recipeExtended({ size: "sm", color: "red", disabled: "no" }),
    "tvs",
    "recipe",
  );

  console.log("\n── createTvs (no merge fn) vs tvs ──");
  console.log(`\n── 5. variants ──`);
  bench("tvs", () => plainBuilder({ size: "sm", color: "red" }));
  bench("createTvs", () => configuredBuilder({ size: "sm", color: "red" }));
}
