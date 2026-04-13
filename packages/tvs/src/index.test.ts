import { describe, expect, it } from "vite-plus/test";
import { cn, createTvs, tvs } from "./index.js";

describe("tvs — base class", () => {
  it("returns the base class when called with no variants", () => {
    const btn = tvs("btn");
    expect(btn({})).toBe("btn");
  });

  it("appends class override", () => {
    const btn = tvs("btn");
    expect(btn({ class: "mt-4" })).toBe("btn mt-4");
  });

  it("appends className override", () => {
    const btn = tvs("btn");
    expect(btn({ className: "mt-4" })).toBe("btn mt-4");
  });

  it("appends both class and className", () => {
    const btn = tvs("btn");
    expect(btn({ class: "mt-2", className: "mt-4" })).toBe("btn mt-2 mt-4");
  });

  it("calls className function with no args and appends result", () => {
    const btn = tvs("btn");
    expect(btn({ className: () => "mt-4" })).toBe("btn mt-4");
  });

  it("ignores className function that returns undefined", () => {
    const btn = tvs("btn");
    expect(btn({ className: () => undefined })).toBe("btn");
  });
});

describe("tvs — variants", () => {
  const btn = tvs("btn").variants({
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

describe("tvs — defaults", () => {
  const btn = tvs("btn")
    .variants({ size: { sm: "text-sm", md: "text-md" }, color: { red: "bg-red", blue: "bg-blue" } })
    .defaults({ size: "md" });

  it("uses default when variant is omitted", () => {
    expect(btn({ color: "red" })).toBe("btn text-md bg-red");
  });

  it("overrides default when variant is provided", () => {
    expect(btn({ size: "sm", color: "blue" })).toBe("btn text-sm bg-blue");
  });
});

describe("tvs — compound variants", () => {
  const btn = tvs("btn")
    .variants({ size: { sm: "text-sm", md: "text-md" }, color: { red: "bg-red", blue: "bg-blue" } })
    .compound([{ size: "sm", color: "red", class: "ring-red" }]);

  it("applies compound class when all conditions match", () => {
    expect(btn({ size: "sm", color: "red" })).toBe("btn text-sm bg-red ring-red");
  });

  it("does not apply compound class when conditions do not match", () => {
    expect(btn({ size: "md", color: "red" })).toBe("btn text-md bg-red");
  });
});

describe("tvs — compound variants with negation", () => {
  const btn = tvs("btn")
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

describe("tvs — boolean variant shorthand", () => {
  const btn = tvs("btn").variants({
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
    const btn2 = tvs("btn").variants({ disabled: "opacity-50" }).defaults({ disabled: false });
    expect(btn2({})).toBe("btn");
    expect(btn2({ disabled: true })).toBe("btn opacity-50");
  });
});

describe("tvs — error on double .variants()", () => {
  it("throws if .variants() is called a second time", () => {
    const builder = tvs("btn").variants({ size: { sm: "text-sm" } });
    expect(() => builder.variants({ color: { red: "bg-red" } })).toThrow(
      "tvs: .variants() can only be called once per builder",
    );
  });
});

describe("tvs — clsx-like class syntax", () => {
  const btn = tvs("btn");

  it("accepts an array for class", () => {
    expect(btn({ class: ["mt-4", "px-2"] })).toBe("btn mt-4 px-2");
  });

  it("accepts an object for class (conditional classes)", () => {
    expect(btn({ class: { "mt-4": true, "px-2": false } })).toBe("btn mt-4");
  });

  it("accepts nested arrays for class", () => {
    expect(btn({ class: ["mt-4", ["px-2", "text-sm"]] })).toBe("btn mt-4 px-2 text-sm");
  });

  it("ignores falsy values in arrays", () => {
    expect(btn({ class: ["mt-4", false, null, undefined, "px-2"] })).toBe("btn mt-4 px-2");
  });

  it("accepts an array for className", () => {
    expect(btn({ className: ["mt-4", "px-2"] })).toBe("btn mt-4 px-2");
  });

  it("accepts an object for className (conditional classes)", () => {
    expect(btn({ className: { "mt-4": true, "px-2": false } })).toBe("btn mt-4");
  });

  it("accepts mixed clsx args in class and className", () => {
    expect(btn({ class: ["mt-4", { "px-2": true }], className: "text-sm" })).toBe(
      "btn mt-4 px-2 text-sm",
    );
  });
});

describe("cn — default instance", () => {
  it("joins strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles arrays and objects", () => {
    expect(cn(["foo", { bar: true, baz: false }])).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });
});

describe("cn — with custom merge", () => {
  it("passes resolved string through merge function", () => {
    const calls: string[] = [];
    const { cn: customCn } = createTvs({
      merge: (...c) => {
        calls.push(...c);
        return c.join("|");
      },
    });
    const result = customCn("foo", ["bar", { baz: true }]);
    expect(result).toBe("foo bar baz");
    expect(calls).toEqual(["foo bar baz"]);
  });
});

describe("createTvs — custom merge", () => {
  it("uses the provided merge function", () => {
    const calls: string[][] = [];
    const customMerge = (...classes: string[]) => {
      calls.push(classes);
      return classes.join("|");
    };
    const { tvs: customTvs } = createTvs({ merge: customMerge });
    const btn = customTvs("btn").variants({ size: { sm: "text-sm" } });
    const result = btn({ size: "sm" });
    expect(result).toBe("btn|text-sm");
    expect(calls).toHaveLength(1);
  });

  it("two instances with different merge functions are independent", () => {
    const { tvs: a } = createTvs({ merge: (...c) => c.join("-") });
    const { tvs: b } = createTvs({ merge: (...c) => c.join("_") });
    expect(a("x").variants({ s: { y: "y" } })({ s: "y" })).toBe("x-y");
    expect(b("x").variants({ s: { y: "y" } })({ s: "y" })).toBe("x_y");
  });
});
