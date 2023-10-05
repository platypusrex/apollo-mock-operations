import type { ListrBaseClassOptions, ListrTask } from 'listr2';
import type { ListrContext } from '../../types';

const subTaskOptions: ListrBaseClassOptions = {
  concurrent: false,
  rendererOptions: { collapseSubtasks: true },
};

export const setupStorybook: ListrTask<ListrContext> = {
  title: 'Setting up storybook...',
  task: (_, task) =>
    task.newListr<ListrContext>(
      [
        {
          title: 'Checking for storybook dependencies',
          task: (_, task) => {
            task.output = 'Checking for storybook deps...';
          },
        },
        {
          title: 'Setup storybook project.',
          task: (_, task) => {
            task.output = 'Setting up new storybook application.';
          },
        },
        {
          title: 'Updating existing storybook config.',
          task: (_, task) => {
            task.output = 'Updating your projects storybook config';
          },
        },
        {
          title: 'Install storybook dependencies.',
          task: (_, task) => {
            task.output = 'Installing storybook dependencies.';
          },
        },
      ],
      subTaskOptions
    ),
};
