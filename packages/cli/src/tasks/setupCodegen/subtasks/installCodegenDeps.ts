import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { codegenPackageNames, codegenPackageNamesNoTS } from '../../../constants';
import { codegenPackageName } from '../../../messages';
import { installDependencies } from '../../../utils';

export const installCodegenDeps: ListrTask<ListrContext> = {
  title: `Installing required ${codegenPackageName} packages.`,
  options: { persistentOutput: true, bottomBar: true },
  task: async ({ pkgManager, codegen, useTS }, task) => {
    const codegenPackages = codegen?.packages?.map((pkg) => Object.keys(pkg)[0]) ?? [];
    const requiredPackages = useTS ? codegenPackageNames : codegenPackageNamesNoTS;

    if (!codegenPackages?.length) {
      task.output = `No ${codegenPackageName} packages detected. Begin fresh installation.`;
      return installDependencies({
        pkgManager,
        deps: requiredPackages,
        saveDev: true,
      });
    }

    // if dependencies are already installed
    // 1. check for required versions
    // 2. determine missing required deps
    // 3. update already installed deps to required versions if
    // 4. add missing deps if any

    const missingCodegenDeps = requiredPackages.filter(
      (pkgName) => !codegenPackages.includes(pkgName)
    );
    if (!missingCodegenDeps) {
      task.skip('All required dependencies are installed.');
      return;
    }

    return installDependencies({
      pkgManager,
      deps: missingCodegenDeps,
      saveDev: true,
    });
  },
};
