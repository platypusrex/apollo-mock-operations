import type { PackageJson } from 'type-fest';

export const findNpmPackages = (pkgJson: PackageJson, pkgNames: string[]) => {
  const { dependencies, devDependencies } = pkgJson;
  const deps = { ...dependencies, ...devDependencies };
  return pkgNames.reduce<Record<string, string>[]>((pkgs, pkgName) => {
    if (deps[pkgName]) {
      const dep = { [pkgName]: deps[pkgName] } as Record<string, string>;
      pkgs = [...pkgs, dep];
    }
    return pkgs;
  }, []);
};
