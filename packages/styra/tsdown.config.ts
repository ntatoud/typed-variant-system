import { defineConfig } from "vite-plus/pack";

export default defineConfig({
  dts: true,
  exports: true,
  attw: {
    enabled: true,
    profile: "esm-only",
  },
});
