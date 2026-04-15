import { describe, expect, it } from "vite-plus/test";

import { createRecipe } from "./index.js";

describe("recipes", () => {
  it("implements a recipe with .implement()", () => {
    const btn = createRecipe({ size: ["sm", "md"] }).implement({
      size: { sm: "text-sm", md: "text-md" },
    });
    expect(btn({ size: "sm" })).toBe("text-sm");
  });

  it("extends two recipes and implements combined variants", () => {
    const extended = createRecipe({ size: ["sm", "md"] })
      .extend(createRecipe({ color: ["red", "blue"] }))
      .implement({
        size: { sm: "text-sm", md: "text-md" },
        color: { red: "bg-red", blue: "bg-blue" },
      });
    expect(extended({ size: "sm", color: "red" })).toBe("text-sm bg-red");
  });

  it("extended recipe preserves variants from both sides", () => {
    const btn = createRecipe({ x: ["on"] })
      .extend(createRecipe({ y: ["on"] }))
      .implement({ x: { on: "x-on" }, y: { on: "y-on" } });
    expect(btn({ x: "on", y: "on" })).toBe("x-on y-on");
  });

  it("later .extend() overwrites duplicate variant keys", () => {
    const btn = createRecipe({ size: ["sm"] })
      .extend(createRecipe({ size: ["sm"] }))
      .implement({ size: { sm: "b-sm" } });
    expect(btn({ size: "sm" })).toBe("b-sm");
  });

  it(".implement() supports .defaults()", () => {
    const btn = createRecipe({ size: ["sm", "md"] })
      .implement({ size: { sm: "text-sm", md: "text-md" } })
      .defaults({ size: "md" });
    expect(btn({})).toBe("text-md");
  });

  it(".implement() supports .compound()", () => {
    const btn = createRecipe({ size: ["sm", "md"], color: ["red", "blue"] })
      .implement({
        size: { sm: "text-sm", md: "text-md" },
        color: { red: "bg-red", blue: "bg-blue" },
      })
      .compound([{ size: "sm", color: "red", class: "extra" }]);
    expect(btn({ size: "sm", color: "red" })).toBe("text-sm bg-red extra");
  });

  it("base class can be added via the class prop", () => {
    const btn = createRecipe({ size: ["sm", "md"] }).implement({
      size: { sm: "text-sm", md: "text-md" },
    });
    expect(btn({ size: "sm", class: "btn" })).toBe("text-sm btn");
  });
});
