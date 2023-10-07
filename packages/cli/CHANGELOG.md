# @apollo-mock-operations/cli

## 0.0.2

### Patch Changes

- 7a0ebc7: Fixes several minor issues:
  - Prevents unnecessary attempt at codegen dependency installation
  - adds type generation enforcement in core step
  - fixes issue where fs.copyFile destination was directory and not file

## 0.0.1

### Patch Changes

- 9a5aaf1: This introduces the first iteration of a cli module that is intended to help initialize
  the setup of apollo-mock-operations. It can create new configurations or update an existing one
  for any type or introspection generation required, and bootstrap the files necessary for getting
  started. Future iterations of the initialization functionality will explore additional setup for
  external modules (id: storybook, jest, cypress, ect).
