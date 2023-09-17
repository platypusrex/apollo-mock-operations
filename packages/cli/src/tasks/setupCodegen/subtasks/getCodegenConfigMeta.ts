import type { ListrTask } from 'listr2';
import type { PackageJson } from 'type-fest';
import type { PluginMeta, ListrContext } from '../../../types';
import { findNpmPackages } from '../../../utils';
import { codegenPackageName } from '../../../messages';

const getGenerationConfigMeta = (
  pkgJson: PackageJson,
  pkgName: string,
  outputPath: string,
  config: Record<string, any>
) => {
  const [clientPresetPkg] = findNpmPackages(pkgJson, [pkgName]);
  const [result] = Object.entries(clientPresetPkg ?? {});
  return {
    dep: result?.[0],
    version: result?.[1],
    outputPath,
    config,
    plugins: config.plugins,
  };
};

export const getCodegenConfigMeta: ListrTask<ListrContext> = {
  title: `Gathering meta on ${codegenPackageName} config.`,
  options: { persistentOutput: true, bottomBar: true },
  skip: ({ codegen }) => {
    if (!codegen?.config) return 'No config file found. Skipping...';
    return false;
  },
  task: (ctx, task) => {
    const { config } = ctx.codegen ?? {};
    if (!config?.generates) {
      task.skip(`No generation config found on ${codegenPackageName} config. Skipping...`);
      return;
    }

    let clientPreset: PluginMeta | undefined;
    let introspection: PluginMeta | undefined;
    let legacy: PluginMeta | undefined;

    for (const generationConfigKey in config.generates) {
      const currentConfig = config.generates[generationConfigKey] as Record<string, any>;
      if (currentConfig?.preset === 'client') {
        clientPreset = getGenerationConfigMeta(
          ctx.pkgJson,
          '@graphql-codegen/client-preset',
          generationConfigKey,
          currentConfig
        );
      }

      if (currentConfig?.plugins?.includes('introspection')) {
        introspection = getGenerationConfigMeta(
          ctx.pkgJson,
          '@graphql-codegen/introspection',
          generationConfigKey,
          currentConfig
        );
      }

      if (currentConfig?.plugins?.includes('typescript')) {
        legacy = getGenerationConfigMeta(
          ctx.pkgJson,
          '@graphql-codegen/typescript',
          generationConfigKey,
          currentConfig
        );
      }
    }

    if (ctx.codegen) {
      ctx.codegen.generation = { clientPreset, introspection, legacy };
    }
  },
};
