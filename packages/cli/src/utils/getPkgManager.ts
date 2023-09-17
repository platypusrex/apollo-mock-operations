import { resolve } from 'path';
import { select } from '@inquirer/prompts';
import type { PkgManager } from '../types';
import { pathExists } from './pathExists';

export const getPkgManager = async (): Promise<PkgManager> => {
  return Promise.all([
    pathExists(resolve(process.cwd(), 'package.lock')),
    pathExists(resolve(process.cwd(), 'yarn.lock')),
    pathExists(resolve(process.cwd(), 'pnpm-lock.yml')),
  ]).then(async ([isNpm, isYarn, isPnpm]) => {
    let pckManager;

    if (isNpm) {
      pckManager = 'npm';
    } else if (isYarn) {
      pckManager = 'yarn';
    } else if (isPnpm) {
      pckManager = 'pnpm';
    } else {
      console.log('No package manager found in project root.');
      pckManager = await select<PkgManager>({
        message: 'Please select your package manager:',
        choices: [
          { name: 'npm', value: 'npm' },
          { name: 'yarn', value: 'yarn' },
          { name: 'pnpm', value: 'pnpm' },
        ],
      });
    }

    return pckManager as PkgManager;
  });
};
