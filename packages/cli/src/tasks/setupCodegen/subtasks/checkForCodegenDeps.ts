import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { findNpmPackages } from '../../../utils';
import { codegenPackageNames } from '../../../constants';
import { codegenPackageName } from '../../../messages';

export const checkForCodegenDeps: ListrTask<ListrContext> = {
  title: `Checking for installed ${codegenPackageName} dependencies.`,
  options: { persistentOutput: true, bottomBar: true },
  task: (ctx, task) => {
    const codegenPackages = findNpmPackages(ctx.pkgJson, codegenPackageNames);
    if (codegenPackages.length && ctx.codegen) {
      task.output = `${codegenPackageName} packages found...`;
      ctx.codegen.packages = codegenPackages;
    } else {
      task.output = `No ${codegenPackageName} packages found...`;
    }
  },
};
