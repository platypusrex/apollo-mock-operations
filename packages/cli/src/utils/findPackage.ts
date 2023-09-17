import type { PackageJson } from 'type-fest';

export const findPackage = (pckJson: PackageJson, packageName: string) => {
  const { dependencies, devDependencies } = pckJson;
  const packages = { ...dependencies, ...devDependencies };
  const name = Object.keys(packages).find((key) => key === packageName);
  return name ?? null;
};
