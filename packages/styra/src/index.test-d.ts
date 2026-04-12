import { describe, expectTypeOf } from "vite-plus/test";
import { type VariantProps, styra } from "./index.js";

describe("VariantProps", () => {
  const btn = styra("btn")
    .variants({ size: { sm: "text-sm", md: "text-md" }, color: { red: "bg-red", blue: "bg-blue" } })
    .defaults({ size: "md" });

  type Props = VariantProps<typeof btn>;

  expectTypeOf<Props>().toMatchTypeOf<{ size?: "sm" | "md"; color: "red" | "blue" }>();
  expectTypeOf<Props>().not.toHaveProperty("class");
  expectTypeOf<Props>().not.toHaveProperty("className");

  // Compatible with React component prop intersections
  type ButtonProps = Props & { children?: string };
  expectTypeOf<ButtonProps>().toMatchTypeOf<{
    size?: "sm" | "md";
    color: "red" | "blue";
    children?: string;
  }>();
});
