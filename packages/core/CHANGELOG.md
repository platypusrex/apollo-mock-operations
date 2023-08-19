# @apollo-mock-operations/core

## 0.3.3

### Patch Changes

- 36333ff: Updates core and dev dependencies for core and storybook-addon packages. No breaking
  changes are expected. Support for storybook v7 will be implemented in the near future. Core
  graphql-codegen dependencies have been update in the codegen-plugin package. This will be a
  breaking change for anyone using codegen typescript dependencies that are not at least >=4.

## 0.3.2

### Patch Changes

- e30f5e8: This is a full migration from yarn to pnpm for dependency management. Also removes the
  use of emotion for styling the dev tools component in favor of a hand rolled solution. The only
  dependency added to support this is the lightweight css parsing lib stylis.

## 0.3.1

### Patch Changes

- ecf08b1: This removes the `defaultOperationState` option from the MockGQLOperations config. This
  configuration doesn't really serve a purpose as long as the default state is a required config
  when created query and mutation operation mocks.

## 0.3.0

### Minor Changes

- 8a2a354: This change is primary driven by a major udpate to the codegen output. The overall
  intention of the codegen updates to support the core package by removing any need for a manual
  typing of either operations or models. You can now take the complete output of both operations and
  models and plugin that into an instance of MockGQLOperations and this will provide complete type
  support for literally everything.

## 0.2.4

### Patch Changes

- 72d9618: This introduces a minor breaking change to both the query and mutation method signatures.
  This is in support of exanding the API to expose setting a default operation state at the
  operation level. With the introduction of an options params in this method, it will be easier to
  support new features for mocking operations/resolvers. While you can still set the default
  operation state at a global operation level, this property is no longer required. And the default
  set at the operation level has priority. There are also several typing improvements and fixes
  included in the release.

## 0.2.3

### Patch Changes

- 79e6002: Fixes "Mutation" defined in resolvers, but not in schema issue.

## 0.2.2

### Patch Changes

- a9f095c: Restructures the projects swc configuration. This is in support of migrating from
  styled-components to emotino for the devtools component.

## 0.2.1

### Patch Changes

- b29197b: This introduces a change to how the devtools component is styled. More specifically, it
  introduces a css-in-js solution (styled-components) and removes the need for a consumer to import
  a stylesheet.

## 0.2.0

### Minor Changes

- 5c26d8d: Breaking change to the MockGQLOperations API. This introduces a required
  defaultOperationState property that is meant to drive the default state for all mocked operations.
  This PR also fixes an issue introduced in the last breaking change regarding setting the initial
  operation map state for the devtools component.

## 0.1.0

### Minor Changes

- cf54e3d: Breaking change to the query and mutation methods APIs. This should simplify the API,
  make operation creation terse (but still readable), and also improves type
  support/auto-completion.

## 0.0.3

### Patch Changes

- 5c4d618: Various fixes for versioning and publishing packages. Attempting fix for tag generation.

## 0.0.2

### Patch Changes

- 70ea330: First generated changeset for initial publish of all modules.
