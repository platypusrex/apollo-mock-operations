---
'@apollo-mock-operations/storybook-addon': patch
'@apollo-mock-operations/core': patch
---

This is a full migration from yarn to pnpm for dependency management. Also removes the use of
emotion for styling the dev tools component in favor of a hand rolled solution. The only dependency
added to support this is the lightweight css parsing lib stylis.
