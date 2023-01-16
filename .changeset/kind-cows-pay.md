---
'@apollo-mock-operations/core': minor
---

Breaking change to the MockGQLOperations API. This introduces a required defaultOperationState
property that is meant to drive the default state for all mocked operations. This PR also fixes an
issue introduced in the last breaking change regarding setting the initial operation map state for
the devtools component.
