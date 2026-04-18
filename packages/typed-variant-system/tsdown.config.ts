import { defineConfig } from "vite-plus/pack";

export default defineConfig({
  entry: ["src/index.ts", "src/recipe.ts", "src/config.ts"],
  dts: true,
  exports: true,
  attw: {
    enabled: true,
    profile: "esm-only",
  },
});
