import { Listr, type ListrBaseClassOptions } from 'listr2';
import type { ListrContext } from '../types';
import { setupCodegen } from './setupCodegen';
import { setupCore } from './setupCore';
import { setupStorybook } from './setupStorybook';

const listrOptions: ListrBaseClassOptions = {
  concurrent: false,
  rendererOptions: { collapseSkips: false },
};

export const tasks = new Listr<ListrContext>(
  [setupCodegen, setupCore, setupStorybook],
  listrOptions
);
