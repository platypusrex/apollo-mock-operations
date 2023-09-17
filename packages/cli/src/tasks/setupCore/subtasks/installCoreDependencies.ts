import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { installDependencies } from '../../../utils';
import { corePackages } from '../../../constants';

export const installCoreDependencies: ListrTask<ListrContext> = {
  title: 'Installing core dependencies.',
  options: { persistentOutput: true, bottomBar: true },
  task: async ({ pkgManager }) => {
    return installDependencies({ pkgManager, deps: corePackages });
  },
};
