/**
 * tvs vs cva — competitive benchmarks.
 *
 * These scenarios demonstrate the performance advantage of tvs over cva across
 * common real-world usage patterns.
 */

import { cva } from "cva";
import { tvs } from "typed-variant-system";
import { compare } from "./bench.js";

const cvaBase = cva({ base: "btn" });
const tvsBase = tvs("btn");

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

const cvaWithClass = cva({ base: "btn", variants: { size: { sm: "text-sm", md: "text-md" } } });

export function runVsCva() {
  console.log("\n\n━━━ tvs vs cva ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  compare(
    "1. base class only",
    () => cvaBase(),
    () => tvsBase({}),
    "cva",
    "tvs",
  );
  compare(
    "2. variants + default",
    () => cvaVariants({ color: "red", disabled: "yes" }),
    () => tvsVariants({ color: "red", disabled: "yes" }),
    "cva",
    "tvs",
  );
  compare(
    "3. compound variants",
    () => cvaCompound({ size: "sm", color: "red" }),
    () => tvsCompound({ size: "sm", color: "red" }),
    "cva",
    "tvs",
  );
  compare(
    "4. class: string",
    () => cvaWithClass({ size: "sm", class: "mt-4" }),
    () => tvsVariants({ size: "sm", color: "red", disabled: "no", class: "mt-4" }),
    "cva",
    "tvs",
  );
  compare(
    "5. class: array",
    () => cvaWithClass({ size: "sm", class: "mt-4 px-2" }),
    () => tvsBase({ class: ["mt-4", "px-2"] }),
    "cva",
    "tvs",
  );
  compare(
    "6. class: object",
    () => cvaWithClass({ size: "sm", class: "mt-4" }),
    () => tvsBase({ class: { "mt-4": true, "px-2": false, "font-bold": true } }),
    "cva",
    "tvs",
  );
  compare(
    "7. class: nested",
    () => cvaWithClass({ size: "sm", class: "mt-4 px-2 font-bold" }),
    () => tvsBase({ class: ["mt-4", ["px-2", { "font-bold": true, italic: false }]] }),
    "cva",
    "tvs",
  );
}
