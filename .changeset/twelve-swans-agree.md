---
'@apollo-mock-operations/cli': patch
---

Fixes several minor issues: 
- Prevents unnecessary attempt at codegen dependency installation 
- adds type generation enforcement in core step 
- fixes issue where fs.copyFile destination was directory and not file
