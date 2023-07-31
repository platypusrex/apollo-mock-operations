---
'@apollo-mock-operations/core': patch
---

This removes the `defaultOperationState` option from the MockGQLOperations config. This
configuration doesn't really serve a purpose as long as the default state is a required config when
created query and mutation operation mocks.
