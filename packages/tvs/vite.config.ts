import { defineConfig as definePackConfig } from "vite-plus/pack";
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: definePackConfig({
    dts: true,
    exports: true,
    attw: {
      enabled: true,
      profile: "esm-only",
    },
  }),
});
