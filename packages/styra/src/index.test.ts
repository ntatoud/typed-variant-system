import { describe, expect, it } from "vite-plus/test";
import { createStyra, styra } from "./index.js";

describe("styra — base class", () => {
  it("returns the base class when called with no variants", () => {
    const btn = styra("btn");
    expect(btn({})).toBe("btn");
  });

  it("appends class override", () => {
    const btn = styra("btn");
    expect(btn({ class: "mt-4" })).toBe("btn mt-4");
  });

  it("appends className override", () => {
    const btn = styra("btn");
    expect(btn({ className: "mt-4" })).toBe("btn mt-4");
  });

  it("appends both class and className", () => {
    const btn = styra("btn");
    expect(btn({ class: "mt-2", className: "mt-4" })).toBe("btn mt-2 mt-4");
  });
});

describe("styra — variants", () => {
  const btn = styra("btn").variants({
    size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
    color: { red: "bg-red", blue: "bg-blue" },
  });

  it("applies a single variant", () => {
    expect(btn({ size: "sm", color: "red" })).toBe("btn text-sm bg-red");
  });

  it("applies multiple variants", () => {
    expect(btn({ size: "lg", color: "blue" })).toBe("btn text-lg bg-blue");
  });
});

describe("styra — defaults", () => {
  const btn = styra("btn")
    .variants({ size: { sm: "text-sm", md: "text-md" }, color: { red: "bg-red", blue: "bg-blue" } })
    .defaults({ size: "md" });

  it("uses default when variant is omitted", () => {
    expect(btn({ color: "red" })).toBe("btn text-md bg-red");
  });

  it("overrides default when variant is provided", () => {
    expect(btn({ size: "sm", color: "blue" })).toBe("btn text-sm bg-blue");
  });
});

describe("styra — compound variants", () => {
  const btn = styra("btn")
    .variants({ size: { sm: "text-sm", md: "text-md" }, color: { red: "bg-red", blue: "bg-blue" } })
    .compound([{ size: "sm", color: "red", class: "ring-red" }]);

  it("applies compound class when all conditions match", () => {
    expect(btn({ size: "sm", color: "red" })).toBe("btn text-sm bg-red ring-red");
  });

  it("does not apply compound class when conditions do not match", () => {
    expect(btn({ size: "md", color: "red" })).toBe("btn text-md bg-red");
  });
});

describe("styra — compound variants with negation", () => {
  const btn = styra("btn")
    .variants({
      size: { sm: "text-sm", md: "text-md", lg: "text-lg" },
      color: { red: "bg-red", blue: "bg-blue" },
    })
    .compound([{ size: { not: "sm" }, color: "red", class: "ring-red" }]);

  it("applies compound class when negation condition passes (value is not the negated one)", () => {
    expect(btn({ size: "md", color: "red" })).toBe("btn text-md bg-red ring-red");
    expect(btn({ size: "lg", color: "red" })).toBe("btn text-lg bg-red ring-red");
  });

  it("does not apply compound class when negation condition fails (value IS the negated one)", () => {
    expect(btn({ size: "sm", color: "red" })).toBe("btn text-sm bg-red");
  });
});

describe("styra — boolean variant shorthand", () => {
  const btn = styra("btn").variants({
    disabled: "opacity-50 pointer-events-none",
    active: "ring-2",
  });

  it("applies shorthand class when prop is true", () => {
    expect(btn({ disabled: true, active: false })).toBe("btn opacity-50 pointer-events-none");
  });

  it("applies nothing when prop is false", () => {
    expect(btn({ disabled: false, active: false })).toBe("btn");
  });

  it("multiple boolean variants together", () => {
    expect(btn({ disabled: true, active: true })).toBe("btn opacity-50 pointer-events-none ring-2");
  });

  it("uses default value for boolean shorthand", () => {
    const btn2 = styra("btn").variants({ disabled: "opacity-50" }).defaults({ disabled: false });
    expect(btn2({})).toBe("btn");
    expect(btn2({ disabled: true })).toBe("btn opacity-50");
  });
});

describe("styra — error on double .variants()", () => {
  it("throws if .variants() is called a second time", () => {
    const builder = styra("btn").variants({ size: { sm: "text-sm" } });
    expect(() => builder.variants({ color: { red: "bg-red" } })).toThrow(
      "styra: .variants() can only be called once per builder",
    );
  });
});

describe("styra — .extend()", () => {
  const buttonVariants = styra("btn")
    .variants({
      size: { sm: "text-sm px-2", md: "text-md px-4", lg: "text-lg px-6" },
      color: { red: "bg-red", blue: "bg-blue" },
    })
    .defaults({ size: "md" });

  const inputGroupButtonVariants = buttonVariants.extend({
    size: { xs: "text-xs px-1", sm: "text-sm px-1.5" },
  });

  it("inherits non-overridden variants", () => {
    expect(inputGroupButtonVariants({ size: "xs", color: "red" })).toContain("bg-red");
    expect(inputGroupButtonVariants({ size: "sm", color: "blue" })).toContain("bg-blue");
  });

  it("uses overridden variant values", () => {
    expect(inputGroupButtonVariants({ size: "xs", color: "red" })).toBe("btn text-xs px-1 bg-red");
    expect(inputGroupButtonVariants({ size: "sm", color: "blue" })).toBe(
      "btn text-sm px-1.5 bg-blue",
    );
  });

  it("drops defaults for overridden variants — callers chain .defaults() to restore them", () => {
    // size was overridden so its default is dropped; callers must set new defaults explicitly
    const withDefaults = inputGroupButtonVariants.defaults({ size: "xs" });
    expect(withDefaults({ color: "red" })).toBe("btn text-xs px-1 bg-red");
  });

  it("applies classes for all provided variants from parent and override", () => {
    const extended = buttonVariants.extend({
      color: { green: "bg-green" },
    });
    expect(extended({ size: "sm", color: "green" })).toBe("btn text-sm px-2 bg-green");
    expect(extended({ size: "lg", color: "green" })).toBe("btn text-lg px-6 bg-green");
  });

  it("does not affect the original builder", () => {
    expect(buttonVariants({ size: "sm", color: "red" })).toBe("btn text-sm px-2 bg-red");
    // "xs" doesn't exist on original — would be a TS error, but at runtime returns no class
    expect(buttonVariants({ size: "xs" as "sm", color: "red" })).toBe("btn bg-red");
  });

  it("inherits compound rules", () => {
    const base = styra("btn")
      .variants({
        size: { sm: "text-sm", md: "text-md" },
        color: { red: "bg-red", blue: "bg-blue" },
      })
      .compound([{ size: "sm", color: "red", class: "ring-red" }]);
    const ext = base.extend({ shape: { round: "rounded-full" } });
    expect(ext({ size: "sm", color: "red", shape: "round" })).toBe(
      "btn text-sm bg-red rounded-full ring-red",
    );
  });
});

describe("createStyra — custom merge", () => {
  it("uses the provided merge function", () => {
    const calls: string[][] = [];
    const customMerge = (...classes: string[]) => {
      calls.push(classes);
      return classes.join("|");
    };
    const { styra: customStyra } = createStyra({ merge: customMerge });
    const btn = customStyra("btn").variants({ size: { sm: "text-sm" } });
    const result = btn({ size: "sm" });
    expect(result).toBe("btn|text-sm");
    expect(calls).toHaveLength(1);
  });

  it("two instances with different merge functions are independent", () => {
    const { styra: a } = createStyra({ merge: (...c) => c.join("-") });
    const { styra: b } = createStyra({ merge: (...c) => c.join("_") });
    expect(a("x").variants({ s: { y: "y" } })({ s: "y" })).toBe("x-y");
    expect(b("x").variants({ s: { y: "y" } })({ s: "y" })).toBe("x_y");
  });
});
