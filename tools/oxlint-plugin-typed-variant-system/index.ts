import type { OxlintConfig } from "vite-plus/lint";

/** Wraps an oxlint config with type inference. Re-exported for use in oxlint.config.ts. */
export function defineConfig<T extends OxlintConfig>(config: T): T {
  return config;
}
import path from "node:path";

/**
 * Oxlint JS plugin for the typed-variant-system package.
 *
 * Enforces a configurable feature dependency tree so that cross-feature
 * imports stay intentional. Each feature can declare exactly which other
 * features it is allowed to import from. Files outside a feature directory
 * (e.g. src/index.ts) are not checked.
 *
 * Quickstart — extend the recommended config in oxlint.config.ts:
 *
 *   import { recommended as tvsRecommended } from "oxlint-plugin-typed-variant-system";
 *
 *   export default defineConfig({
 *     extends: [tvsRecommended],
 *   });
 *
 * The recommended config registers the plugin and enables the rule with
 * the default typed-variant-system feature tree. Override `tree` in the rule options if
 * you need a different configuration.
 *
 * Features whose names are not keys in `tree` are unrestricted.
 */

/** Maps each feature name to the list of features it may import from. */
export type FeatureTree = Record<string, string[]>;

export interface RuleOptions {
  /**
   * Segment of the file path that identifies the features root.
   * Defaults to "src/features".
   */
  featuresDir?: string;
  /**
   * Dependency allow-list per feature. A feature listed here may only import
   * from the features named in its array (plus itself). A feature not listed
   * is not restricted by this rule.
   */
  tree: FeatureTree;
}

// Minimal ESLint-compatible types so the file compiles under strict mode
// without requiring @types/eslint as a direct dependency.
interface RuleContext {
  options: unknown[];
  getFilename(): string;
  report(descriptor: { node: unknown; message: string }): void;
}

interface ImportDeclarationNode {
  source: { value: string };
}

/**
 * Returns the feature name that owns the given absolute file path,
 * or null if the path is not under a features directory.
 *
 * Example:
 *   filePath    = "/repo/packages/typed-variant-system/src/features/core/index.ts"
 *   featuresDir = "src/features"
 *   → "core"
 */
function getFeature(filePath: string, featuresDir: string): string | null {
  const normalized = filePath.replace(/\\/g, "/");
  const marker = `/${featuresDir.replace(/\\/g, "/").replace(/^\/|\/$/g, "")}/`;
  const idx = normalized.lastIndexOf(marker);
  if (idx === -1) return null;
  const segment = normalized.slice(idx + marker.length).split("/")[0];
  return segment || null;
}

const noRestrictedFeatureImports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow cross-feature imports that violate the configured dependency tree",
    },
    schema: [
      {
        type: "object",
        properties: {
          featuresDir: { type: "string" },
          tree: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        required: ["tree"],
        additionalProperties: false,
      },
    ],
  },

  create(context: RuleContext) {
    const options = (context.options[0] ?? {}) as RuleOptions;
    const featuresDir = options.featuresDir ?? "src/features";
    const tree = options.tree ?? {};

    const filename = context.getFilename();
    const currentFeature = getFeature(filename, featuresDir);

    // File is not inside a known feature, or the feature is not restricted.
    if (!currentFeature || !(currentFeature in tree)) return {};

    const allowedDeps = tree[currentFeature]!;

    return {
      ImportDeclaration(node: ImportDeclarationNode) {
        const importPath: string = node.source.value;

        // Only check relative imports — bare specifiers are package imports.
        if (!importPath.startsWith(".")) return;

        const dir = path.dirname(filename);
        const resolved = path.resolve(dir, importPath);
        const importedFeature = getFeature(resolved, featuresDir);

        // Not targeting a feature, or targeting itself — nothing to check.
        if (!importedFeature || importedFeature === currentFeature) return;

        if (!allowedDeps.includes(importedFeature)) {
          const allowed = allowedDeps.length ? allowedDeps.join(", ") : "none";
          context.report({
            node: node.source,
            message: `Feature '${currentFeature}' cannot import from '${importedFeature}'. Allowed: [${allowed}].`,
          });
        }
      },
    };
  },
};

const plugin = {
  rules: {
    "no-restricted-feature-imports": noRestrictedFeatureImports,
  },
};

export default plugin;

/** Ready-made jsPlugins entry for oxlint.config.ts. */
export const jsPlugin = { name: "tvs", specifier: "oxlint-plugin-typed-variant-system" } as const;

/**
 * Recommended oxlint config for the typed-variant-system package.
 *
 * Registers the plugin and enables `no-restricted-feature-imports` with the
 * default feature dependency tree scoped to `packages/typed-variant-system/src`.
 */
export const recommended = {
  jsPlugins: [jsPlugin],
  overrides: [
    {
      files: ["packages/typed-variant-system/src/**"],
      rules: {
        "tvs/no-restricted-feature-imports": [
          "error",
          {
            tree: {
              core: ["internal-core"],
              recipe: ["internal-core", "core"],
              "pre-configured-tvs": ["internal-core", "core"],
            },
          },
        ],
      },
    },
  ],
} satisfies OxlintConfig;
