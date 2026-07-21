# Versioned documentation

## Objective

Keep released `simple-ascii-chart` documentation available while making the current release easy to find. Documentation and examples use canonical versioned URLs. A visible version picker switches versions without silently mixing APIs or outputs.

## Commands

- Generate current documentation: `yarn docs:generate`
- Verify generated snapshots: `yarn docs:check`
- Test: `yarn test`
- Type-check: `yarn typecheck`
- Lint: `yarn lint`
- Build: `yarn build`

## Project structure

- `lib/documentationVersions.mjs`: latest-version constant, supported-version registry, validation, and route mapping.
- `app/generated/api-docs.ts`: generated immutable documentation snapshots keyed by version.
- `app/documentation/[version]`: version overview.
- `app/documentation/[version]/[surface]`: version-specific API surface.
- `app/examples/[version]`: version-specific examples and outputs.
- `app/playground/[version]`: version-specific interactive playground.
- `package.json`: exact current dependency plus version-specific npm aliases for historical playground runtimes.
- `components/LibraryVersionPicker.tsx`: accessible global version switcher.
- `components/libraryVersionStore.ts`: persistent whole-site version preference.
- `components/NavControls.tsx`: shared top-right version and theme controls.

## Interface

```ts
type DocumentationVersion = {
  id: string;
  surfaces: readonly string[];
};
```

Canonical routes are `/documentation/{version}`, `/documentation/{version}/{surface}`, `/examples/{version}`, and `/playground/{version}`. Unversioned routes redirect to the latest version.

The picker appears beside the theme control on every page. Documentation, example, and playground routes switch immediately. Playground query parameters survive version switches. Other pages retain their route while version-aware links follow the persisted selection.

## Adding a version

1. Update `LATEST_DOCUMENTATION_VERSION` and add the release to `DOCUMENTATION_VERSIONS`.
2. Add its description under `documentation.versions` in `messages/en.json`.
3. Add or generate its declaration and example snapshots.
4. Add the exact release as a dependency alias and register its package import in `lib/editablePlot.mjs`.
5. Run `yarn docs:generate` and every verification command above.

The picker, canonical routes, sitemap, static parameters, and navigation links all derive from the registry.

## Testing strategy

- Unit tests enforce registry ordering, route generation, version/surface validation, runtime selection, and snapshot completeness.
- Component tests verify the picker and version-specific pages.
- Build verification proves every supported version route is statically generated.
- Browser checks cover switching, anchors, focus, console output, and responsive layout.

## Boundaries

- Always keep released snapshots immutable and version labels exact.
- Always execute current-version examples against the installed current artifact.
- Ask before removing a documented version or changing canonical version URLs.
- Never make old documentation execute against a newer library runtime.
- Never make an old playground execute against a newer library runtime.
- Every selectable playground version must resolve to an exact matching dependency; never use a version range for runtime aliases.

## Success criteria

- Users can switch between `6.0.0` and `5.4.0` from the global navigation.
- URLs are shareable and version-specific.
- `5.4.0` shows only its historical public surface and output.
- Existing unversioned links resolve to the latest documentation.
- Sitemap, metadata, tests, and generated-data checks cover every version.
