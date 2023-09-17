import { join } from 'path';
import { readJsonSync, writeJSONSync } from 'fs-extra';
import type { PackageJson } from 'type-fest';

export const writeToPkgJson = (callback: (pkgJson: PackageJson) => PackageJson): void => {
  try {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = readJsonSync(packageJsonPath);
    const updatedPackageJson = callback(packageJson);
    writeJSONSync(packageJsonPath, updatedPackageJson, { spaces: 2 });
  } catch (e) {
    throw new Error('Failed to update package.json');
  }
};
