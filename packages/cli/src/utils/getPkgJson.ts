import { resolve } from 'path';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import type { PackageJson } from 'type-fest';

export const getPkgJson = (): PackageJson => {
  try {
    const pkgPath = resolve(process.cwd(), 'package.json');
    const pkgContent = readFileSync(pkgPath, 'utf8');
    return JSON.parse(pkgContent) as PackageJson;
  } catch (e) {
    throw new Error(
      `A ${chalk.blueBright(
        'package.json'
      )} file was not found the root directory. You either need to initialize a ${chalk.blueBright(
        'package.json'
      )} or make sure '${chalk.blueBright(
        'npx create-apollo-mocks init'
      )}' is run in the root of your project.`
    );
  }
};
