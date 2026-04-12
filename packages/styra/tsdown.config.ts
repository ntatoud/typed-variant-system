import { defineConfig } from "vite-plus/pack";

export default defineConfig({
  dts: {
    tsgo: true,
  },
  exports: true,
  attw: {
    enabled: true,
    profile: "esm-only",
  },
});
