import { defineConfig, recommended as tvsRecommended } from "oxlint-plugin-typed-variant-system";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  extends: [tvsRecommended],
});
