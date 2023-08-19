# @apollo-mock-operations/codegen-plugin

## 0.3.0

### Minor Changes

- 36333ff: Updates core and dev dependencies for core and storybook-addon packages. No breaking
  changes are expected. Support for storybook v7 will be implemented in the near future. Core
  graphql-codegen dependencies have been update in the codegen-plugin package. This will be a
  breaking change for anyone using codegen typescript dependencies that are not at least >=4.

## 0.2.0

### Minor Changes

- 8a2a354: This change is primary driven by a major udpate to the codegen output. The overall
  intention of the codegen updates to support the core package by removing any need for a manual
  typing of either operations or models. You can now take the complete output of both operations and
  models and plugin that into an instance of MockGQLOperations and this will provide complete type
  support for literally everything.

## 0.1.1

### Patch Changes

- a9f095c: Restructures the projects swc configuration. This is in support of migrating from
  styled-components to emotino for the devtools component.

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
