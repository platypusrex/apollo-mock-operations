# @apollo-mock-operations/core

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
