import execa from 'execa';
import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';

export const runTypeGeneration: ListrTask<ListrContext> = {
  title: 'Attempting type and GQL introspection generation.',
  task: async ({ pkgManager, codegen }, task) => {
    if (!codegen) throw new Error('Missing codegen config meta.');
    try {
      const executeTypeGenCommand = execa(pkgManager, ['run', codegen.scriptName], {
        cwd: process.cwd(),
      });
      if (executeTypeGenCommand.stdout) executeTypeGenCommand.stdout.pipe(task.stdout());
      if (executeTypeGenCommand.stderr) executeTypeGenCommand.stderr.pipe(task.stdout());
      await executeTypeGenCommand;
    } catch (e) {
      await task.prompt({
        message: `Failed to load schema from ${codegen.config.schema}. Please start the GQL server and rerun the init cli.`,
        type: 'Select',
        choices: ['Ok'],
        required: true,
      });

      process.exit(1);
    }
  },
};
