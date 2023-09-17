import type { PackageJson } from 'type-fest';
import chalk from 'chalk';
import { findPackage } from './findPackage';

export const checkForTS = (pkgJson: PackageJson) => {
  const isTSInstalled = !!findPackage(pkgJson, 'typescript');
  if (!isTSInstalled) {
    console.info(
      `\nTypescript install was not found. For the best experience using ${chalk.blueBright(
        '@apollo-mock-operations'
      )}, typescript is highly recommended 😉.\n`
    );
  }
  return isTSInstalled;
};
