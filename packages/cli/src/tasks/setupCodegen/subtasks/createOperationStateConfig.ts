import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { copyTemplateFiles, getCosmicConfigFile } from '../../../utils';

export const createOperationStateConfig: ListrTask<ListrContext> = {
  title: 'Creating operation state config file.',
  enabled: (ctx) => ctx.useTS,
  options: { persistentOutput: true, bottomBar: true },
  task: async (_, task) => {
    const moduleName = 'apolloMock';
    const result = await getCosmicConfigFile(moduleName);

    if (result) {
      task.skip('Operation state config found. Skipping...');
      return;
    }

    const templateFile = `${moduleName}.config.ts`;
    await copyTemplateFiles('apolloMockConfig', templateFile);
  },
};
