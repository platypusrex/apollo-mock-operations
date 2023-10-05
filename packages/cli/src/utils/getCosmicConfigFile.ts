import { cosmiconfig } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import type { CosmiconfigResult } from 'cosmiconfig/dist/types';

const searchPlaces = (moduleName: string) => {
  return [
    'package.json',
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.js`,
    `.${moduleName}rc.ts`,
    `.${moduleName}rc.mjs`,
    `.${moduleName}rc.cjs`,
    `.config/${moduleName}rc`,
    `.config/${moduleName}rc.json`,
    `.config/${moduleName}rc.yaml`,
    `.config/${moduleName}rc.yml`,
    `.config/${moduleName}rc.js`,
    `.config/${moduleName}rc.ts`,
    `.config/${moduleName}rc.cjs`,
    `${moduleName}.config.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.mjs`,
    `${moduleName}.config.cjs`,
    `${moduleName}.js`,
    `${moduleName}.ts`,
    `${moduleName}.json`,
    `${moduleName}.mjs`,
    `${moduleName}.cjs`,
    `${moduleName}.yml`,
    `${moduleName}.yaml`,
  ];
};
export const getCosmicConfigFile = (moduleName: string): Promise<CosmiconfigResult> =>
  cosmiconfig('apolloMock', {
    searchPlaces: searchPlaces(moduleName),
    loaders: { '.ts': TypeScriptLoader() },
  }).search();
