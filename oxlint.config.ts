import { defineConfig, recommended as tvsRecommended } from "oxlint-plugin-tvs";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  extends: [tvsRecommended],
});
