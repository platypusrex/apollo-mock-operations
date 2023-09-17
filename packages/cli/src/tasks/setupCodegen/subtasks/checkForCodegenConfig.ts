import { parse } from 'path';
import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { getCosmicConfigFile } from '../../../utils';
import { codegenPackageName } from '../../../messages';

export const checkForCodegenConfig: ListrTask<ListrContext> = {
  title: `Checking for ${codegenPackageName} config.`,
  options: { persistentOutput: true, bottomBar: true },
  task: async (ctx, task) => {
    const moduleName = 'codegen';
    const result = await getCosmicConfigFile(moduleName);

    if (!result?.config) {
      task.output = 'No config file found.';
      return;
    }

    task.output = 'Config file found.';
    const { config, filepath } = result!;
    if (ctx.codegen) {
      ctx.codegen.config = config;

      const { ext, name, dir } = parse(filepath);
      ctx.codegen.file = { path: dir, name, ext, fullpath: filepath };
    }
  },
};
