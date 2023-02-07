---
'@apollo-mock-operations/core': patch
---

This introduces a minor breaking change to both the query and mutation method signatures. This is in
support of exanding the API to expose setting a default operation state at the operation level. With
the introduction of an options params in this method, it will be easier to support new features for
mocking operations/resolvers. While you can still set the default operation state at a global
operation level, this property is no longer required. And the default set at the operation level has
priority. There are also several typing improvements and fixes included in the release.
