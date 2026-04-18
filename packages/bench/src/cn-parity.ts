/**
 * cn / cnTw parity benchmarks.
 *
 * tvs re-exports cn (built on the same toVal() internals) and createTvs lets
 * users plug in a custom merge function (e.g. twMerge). These benchmarks
 * verify that the wrappers add no measurable overhead vs their reference
 * implementations (clsx and twMerge respectively).
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createTvs } from "typed-variant-system/config";
import { cn } from "typed-variant-system";
import { compare } from "./bench.js";

const { cn: cnTw } = createTvs({ merge: twMerge });

export function runCnParity() {
  console.log("\n\n━━━ cn parity ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  (expected: ~1.0x — re-export with no overhead)");

  compare(
    "1. strings",
    () => clsx("btn", "mt-4", "px-2"),
    () => cn("btn", "mt-4", "px-2"),
    "clsx",
    "cn",
  );
  compare(
    "2. array + object",
    () => clsx(["btn", "mt-4", { "font-bold": true, italic: false }]),
    () => cn(["btn", "mt-4", { "font-bold": true, italic: false }]),
    "clsx",
    "cn",
  );
  compare(
    "3. cnTw: strings",
    () => twMerge("btn", "mt-4", "px-2"),
    () => cnTw("btn", "mt-4", "px-2"),
    "twMerge",
    "cnTw",
  );
  compare(
    "4. cnTw: array+obj",
    () => twMerge(clsx(["btn", "mt-4", { "font-bold": true, italic: false }])),
    () => cnTw(["btn", "mt-4", { "font-bold": true, italic: false }]),
    "twMerge+clsx",
    "cnTw",
  );
}
