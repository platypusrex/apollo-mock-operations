---
'@apollo-mock-operations/codegen-plugin': minor
'@apollo-mock-operations/core': minor
---

This change is primary driven by a major udpate to the codegen output. The overall intention of the
codegen updates to support the core package by removing any need for a manual typing of either
operations or models. You can now take the complete output of both operations and models and plugin
that into an instance of MockGQLOperations and this will provide complete type support for literally
everything.
