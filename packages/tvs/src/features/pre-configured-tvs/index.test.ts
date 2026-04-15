import { describe, expect, it } from "vite-plus/test";

import { createTvs } from "./index.js";

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
