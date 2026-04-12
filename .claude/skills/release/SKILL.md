---
name: release
description: Full release workflow for npm packages — bumps version, generates changelog, creates a release PR, merges it, creates an annotated git tag with the changelog as description, publishes to npm, and creates a GitHub release. Use when the user says "release", "cut a release", "publish a new version", "bump version", or asks to do a vX.Y.Z release.
---

# Release

End-to-end release workflow: version bump → changelog → PR → merge → tag → npm publish → GitHub release.

## Prerequisites

- `gh` CLI authenticated
- `npm` authenticated (`npm whoami`)
- On `main` branch, clean working tree

## Workflow

### 1. Determine version

Ask the user for the version bump type (patch / minor / major) or target version if not already specified. Check the current version in `packages/<name>/package.json`.

### 2. Update version

Edit `packages/<name>/package.json` — bump `"version"`.

### 3. Generate changelog entry

Run `git log <last-tag>..HEAD --oneline` to collect commits since last release. Group them into sections:

```
### Added
### Changed
### Fixed
### Removed
```

Prepend a new `## [X.Y.Z] - YYYY-MM-DD` section to `CHANGELOG.md`. Omit empty sections. Use today's date (available in system context as `currentDate`).

### 4. Create release PR

```bash
git checkout -b release/vX.Y.Z
git add packages/<name>/package.json CHANGELOG.md
git commit -m "chore: release vX.Y.Z"
git push -u origin release/vX.Y.Z
gh pr create --title "chore: release vX.Y.Z" --body "$(cat <<'EOF'
## Release vX.Y.Z

<paste the changelog section here>

## Checklist
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated
- [ ] Tests pass
EOF
)"
```

### 5. Wait for CI / approval

Tell the user the PR URL and ask them to approve/merge, or ask if they want you to merge it directly.

To merge directly:

```bash
gh pr merge --squash --delete-branch
git checkout main && git pull
```

### 6. Create annotated tag

```bash
git tag -a vX.Y.Z <commit-sha> -m "$(cat <<'EOF'
vX.Y.Z - YYYY-MM-DD

### Added
...
EOF
)"
git push origin vX.Y.Z
```

The tag message should contain the changelog section for this version (no markdown heading, just the content).

### 7. Publish to npm

```bash
cd packages/<name>
vp pack   # builds the package
npm publish --access public
```

### 8. Create GitHub release

```bash
gh release create vX.Y.Z --notes-from-tag --title "vX.Y.Z"
```

`--notes-from-tag` pulls the annotated tag message as release notes automatically.

## Notes

- For monorepos with multiple publishable packages, repeat steps 2–8 per package, or scope the release to the relevant package.
- If a lightweight tag already exists for the version, delete and recreate it as annotated: `git tag -d vX.Y.Z && git push --force origin :refs/tags/vX.Y.Z`, then run step 6.
- Always confirm with the user before `npm publish` and before any `git push --force`.
