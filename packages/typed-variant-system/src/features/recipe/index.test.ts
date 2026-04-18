import { describe, expect, it } from "vite-plus/test";

import { recipe } from "./index.js";

describe("recipes", () => {
  it("implements a recipe with .implement()", () => {
    const btn = recipe({ size: ["sm", "md"] }).implement({
      size: { sm: "text-sm", md: "text-md" },
    });
    expect(btn({ size: "sm" })).toBe("text-sm");
  });

  it(".implement() supports a base class", () => {
    const btn = recipe({ size: ["sm", "md"] }).implement({
      base: "btn",
      size: { sm: "text-sm", md: "text-md" },
    });
    expect(btn({ size: "sm" })).toBe("btn text-sm");
  });

  it(".and() composes two non-conflicting recipes", () => {
    const combined = recipe({ size: ["sm", "md"] }).and(recipe({ color: ["red", "blue"] }));
    const btn = combined.implement({
      size: { sm: "text-sm", md: "text-md" },
      color: { red: "bg-red", blue: "bg-blue" },
    });
    expect(btn({ size: "sm", color: "red" })).toBe("text-sm bg-red");
  });

  it(".and() preserves variants from both sides", () => {
    const btn = recipe({ x: ["on"] })
      .and(recipe({ y: ["on"] }))
      .implement({ x: { on: "x-on" }, y: { on: "y-on" } });
    expect(btn({ x: "on", y: "on" })).toBe("x-on y-on");
  });

  it(".merge() unions values on conflicting keys", () => {
    const a = recipe({ size: ["sm", "md"] });
    const b = recipe({ size: ["lg", "xl"] });
    const merged = a.merge(b);
    const btn = merged.implement({
      size: { sm: "text-sm", md: "text-md", lg: "text-lg", xl: "text-xl" },
    });
    expect(btn({ size: "sm" })).toBe("text-sm");
    expect(btn({ size: "lg" })).toBe("text-lg");
  });

  it(".merge() combines non-conflicting keys too", () => {
    const combined = recipe({ size: ["sm"] }).merge(recipe({ color: ["red"] }));
    const btn = combined.implement({ size: { sm: "text-sm" }, color: { red: "bg-red" } });
    expect(btn({ size: "sm", color: "red" })).toBe("text-sm bg-red");
  });

  it(".variants() adds ad-hoc keys to a recipe", () => {
    const shape = recipe({ size: ["sm", "md"] }).variants({ color: ["red", "blue"] as const });
    const btn = shape.implement({
      size: { sm: "text-sm", md: "text-md" },
      color: { red: "bg-red", blue: "bg-blue" },
    });
    expect(btn({ size: "sm", color: "red" })).toBe("text-sm bg-red");
  });

  it(".implement() supports .defaults()", () => {
    const btn = recipe({ size: ["sm", "md"] })
      .implement({ size: { sm: "text-sm", md: "text-md" } })
      .defaults({ size: "md" });
    expect(btn({})).toBe("text-md");
  });

  it(".implement() supports .compound()", () => {
    const btn = recipe({ size: ["sm", "md"], color: ["red", "blue"] })
      .implement({
        size: { sm: "text-sm", md: "text-md" },
        color: { red: "bg-red", blue: "bg-blue" },
      })
      .compound([{ size: "sm", color: "red", class: "extra" }]);
    expect(btn({ size: "sm", color: "red" })).toBe("text-sm bg-red extra");
  });

  it("base class can be added via the class prop", () => {
    const btn = recipe({ size: ["sm", "md"] }).implement({
      size: { sm: "text-sm", md: "text-md" },
    });
    expect(btn({ size: "sm", class: "btn" })).toBe("text-sm btn");
  });
});

describe("callable recipe", () => {
  it("recipe(shape)(base) creates a constrained builder", () => {
    const shape = recipe({ size: ["sm", "md"] as const });
    const btn = shape("btn").variants({ size: { sm: "text-sm", md: "text-md" } });
    expect(btn({ size: "sm" })).toBe("btn text-sm");
  });

  it("callable recipe includes the base class", () => {
    const shape = recipe({ size: ["sm", "md"] as const });
    const btn = shape("base-class").variants({ size: { sm: "a", md: "b" } });
    expect(btn({ size: "md" })).toBe("base-class b");
  });

  it("composed recipe is callable", () => {
    const size = recipe({ size: ["sm", "md"] as const });
    const intent = recipe({ intent: ["primary", "danger"] as const });
    const btn = size
      .and(intent)("btn")
      .variants({
        size: { sm: "text-sm", md: "text-md" },
        intent: { primary: "bg-blue", danger: "bg-red" },
      });
    expect(btn({ size: "sm", intent: "danger" })).toBe("btn text-sm bg-red");
  });

  it(".and() accepts a plain shape object", () => {
    const combined = recipe({ size: ["sm", "md"] as const }).and({
      color: ["red", "blue"] as const,
    });
    const btn = combined.implement({
      size: { sm: "text-sm", md: "text-md" },
      color: { red: "bg-red", blue: "bg-blue" },
    });
    expect(btn({ size: "sm", color: "red" })).toBe("text-sm bg-red");
  });

  it(".merge() accepts a plain shape object", () => {
    const merged = recipe({ size: ["sm", "md"] as const }).merge({ size: ["lg"] as const });
    const btn = merged.implement({ size: { sm: "text-sm", md: "text-md", lg: "text-lg" } });
    expect(btn({ size: "lg" })).toBe("text-lg");
  });

  it("callable recipe supports .defaults()", () => {
    const shape = recipe({ size: ["sm", "md"] as const });
    const btn = shape("btn")
      .variants({ size: { sm: "text-sm", md: "text-md" } })
      .defaults({ size: "md" });
    expect(btn({})).toBe("btn text-md");
  });
});
