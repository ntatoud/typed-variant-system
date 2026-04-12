import { describe, expectTypeOf, it } from "vite-plus/test";
import { type VariantProps, styra } from "./index.js";

describe("VariantProps", () => {
  const btn = styra("btn")
    .variants({ size: { sm: "text-sm", md: "text-md" }, color: { red: "bg-red", blue: "bg-blue" } })
    .defaults({ size: "md" });

  type Props = VariantProps<typeof btn>;

  expectTypeOf<Props>().toMatchTypeOf<{ size?: "sm" | "md"; color: "red" | "blue" }>();
  expectTypeOf<Props>().not.toHaveProperty("class");
  expectTypeOf<Props>().not.toHaveProperty("className");

  // Boolean shorthand variants expose `boolean` prop type
  const toggled = styra("base").variants({ disabled: "opacity-50", size: { sm: "text-sm" } });
  type ToggledProps = VariantProps<typeof toggled>;
  it("exposes boolean prop type for shorthand variants", () => {
    expectTypeOf<ToggledProps>().toMatchTypeOf<{ disabled: boolean; size: "sm" }>();
  });

  // Compatible with React component prop intersections
  type ButtonProps = Props & { children?: string };
  expectTypeOf<ButtonProps>().toMatchTypeOf<{
    size?: "sm" | "md";
    color: "red" | "blue";
    children?: string;
  }>();
});
