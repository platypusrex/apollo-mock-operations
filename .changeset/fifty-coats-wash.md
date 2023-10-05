---
'@apollo-mock-operations/cli': patch
---

This introduces the first iteration of a cli module that is intended to help initialize the setup of
apollo-mock-operations. It can create new configurations or update an existing one for any type or
introspection generation required, and bootstrap the files necessary for getting started. Future
iterations of the initialization functionality will explore additional setup for external modules
(id: storybook, jest, cypress, ect).
