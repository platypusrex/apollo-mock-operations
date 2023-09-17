import type { Readable } from 'stream';
import execa from 'execa';
import type { ListrContext } from '../types';

type ExecParams = Record<
  ListrContext['pkgManager'],
  {
    args: string[];
    output: 'stdout' | 'stderr';
  }
>;

const execParams: ExecParams = {
  npm: {
    args: ['install', '--verbose'],
    output: 'stderr',
  },
  yarn: {
    args: ['add', '--verbose'],
    output: 'stdout',
  },
  pnpm: {
    args: ['add'],
    output: 'stdout',
  },
};

interface InstallDependencies extends Pick<ListrContext, 'pkgManager'> {
  deps: string[];
  saveDev?: boolean;
}

export const installDependencies = ({
  pkgManager,
  deps,
  saveDev,
}: InstallDependencies): Readable | null => {
  const depArgs = saveDev ? ['-D', ...deps] : deps;
  const args = [...execParams[pkgManager].args, ...depArgs];
  return execa(pkgManager, args, { cwd: process.cwd() })[execParams[pkgManager].output];
};
