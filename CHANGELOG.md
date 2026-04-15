# Changelog

All notable changes to `typed-variant-system` will be documented in this file.

## [0.4.1] - 2026-04-15

### Fixed

- Fix empty npm publish by adding `prepublishOnly` build step

## [0.4.0] - 2026-04-15

### Added

- Recipe system for reusable variant schemas ([#21](https://github.com/ntatoud/typed-variant-system/pull/21))
- Oxlint/oxfmt configs and typed-variant-system feature boundary plugin ([#25](https://github.com/ntatoud/typed-variant-system/pull/25))

### Changed

- Feature folders and treeshaking refactor ([#23](https://github.com/ntatoud/typed-variant-system/pull/23))
- Size-limit and tree-shaking checks added to CI ([#24](https://github.com/ntatoud/typed-variant-system/pull/24))

## [0.3.0] - 2026-04-13

### Added

- Array syntax for compound variant conditions — match multiple values with `["sm", "md"]` or exclude multiple values with `{ not: ["sm", "md"] }` ([#20](https://github.com/ntatoud/typed-variant-system/pull/20))

### Changed

- Rename package from `styra` to `typed-variant-system`
- Remove `@ntatoud` scope prefix from package name

### Removed

- Intent skills to reduce package size

## [0.2.0] - 2026-04-12

### Added

- Intent skills for AI agent support ([#17](https://github.com/ntatoud/typed-variant-system/pull/17))

## [0.1.0] - 2026-04-12

### Added

- `clsx`-like syntax and `cn` utility for merging class names ([#14](https://github.com/ntatoud/typed-variant-system/pull/14))
- Support for function form of `className` prop ([#13](https://github.com/ntatoud/typed-variant-system/pull/13))
- Boolean variant shorthand (e.g. `<Button loading />`)
- `VariantProps` helper type export
- MIT License
- Type-safe class variance builder as a maintained CVA replacement
- Benchmark package comparing batched CVA vs typed-variant-system performance
- Published as `typed-variant-system` on npm
