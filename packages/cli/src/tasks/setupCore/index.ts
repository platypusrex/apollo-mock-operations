import type { ListrBaseClassOptions, ListrTask } from 'listr2';
import type { ListrContext } from '../../types';
import { installCoreDependencies, runTypeGeneration, setupJSCoreFiles, setupTSCoreFiles } from './subtasks';

const subTaskOptions: ListrBaseClassOptions = {
  concurrent: false,
  rendererOptions: { collapseSubtasks: true },
};

export const setupCore: ListrTask<ListrContext> = {
  title: 'Setting up apollo-mock-operations core...',
  task: (_, task) =>
    task.newListr<ListrContext>(
      [runTypeGeneration, setupTSCoreFiles, setupJSCoreFiles, installCoreDependencies],
      subTaskOptions
    ),
};
