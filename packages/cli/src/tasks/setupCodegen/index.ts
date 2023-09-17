import type { ListrBaseClassOptions, ListrTask } from 'listr2';
import type { ListrContext } from '../../types';
import {
  getCodegenConfigMeta,
  checkForCodegenConfig,
  checkForCodegenDeps,
  createOperationStateConfig,
  updateCodegenConfig,
  createJSCodegenConfig,
  installCodegenDeps,
  createTSCodegenConfig,
} from './subtasks';

const subTaskOptions: ListrBaseClassOptions = {
  concurrent: false,
  rendererOptions: {
    collapseSubtasks: true,
  },
};

export const setupCodegen: ListrTask<ListrContext> = {
  title: 'Setting up graphql-codegen...',
  task: (_, task) =>
    task.newListr<ListrContext>(
      [
        checkForCodegenDeps,
        checkForCodegenConfig,
        getCodegenConfigMeta,
        createOperationStateConfig,
        updateCodegenConfig,
        createTSCodegenConfig,
        createJSCodegenConfig,
        installCodegenDeps,
      ],
      subTaskOptions
    ),
};
