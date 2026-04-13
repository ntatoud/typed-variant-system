# Changelog

All notable changes to `tvs` will be documented in this file.

## [0.3.0] - 2026-04-13

### Added

- Array syntax for compound variant conditions — match multiple values with `["sm", "md"]` or exclude multiple values with `{ not: ["sm", "md"] }` ([#20](https://github.com/ntatoud/tvs/pull/20))

### Changed

- Rename package from `styra` to `tvs`
- Remove `@ntatoud` scope prefix from package name

### Removed

- Intent skills to reduce package size

## [0.2.0] - 2026-04-12

### Added

- Intent skills for AI agent support ([#17](https://github.com/ntatoud/tvs/pull/17))

## [0.1.0] - 2026-04-12

### Added

- `clsx`-like syntax and `cn` utility for merging class names ([#14](https://github.com/ntatoud/tvs/pull/14))
- Support for function form of `className` prop ([#13](https://github.com/ntatoud/tvs/pull/13))
- Boolean variant shorthand (e.g. `<Button loading />`)
- `VariantProps` helper type export
- MIT License
- Type-safe class variance builder as a maintained CVA replacement
- Benchmark package comparing batched CVA vs tvs performance
- Published as `tvs` on npm
