import execa from 'execa';
import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';

export const runTypeGeneration: ListrTask<ListrContext> = {
  title: 'Attempting type and GQL introspection generation.',
  task: async ({ pkgManager, codegen }) => {
    if (!codegen) throw new Error('Missing codegen config meta.');
    return execa(pkgManager, ['run', codegen.scriptName], { cwd: process.cwd() }).stdout;
  },
};
