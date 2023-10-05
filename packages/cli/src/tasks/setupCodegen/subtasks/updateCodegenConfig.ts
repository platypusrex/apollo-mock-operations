import { inspect } from 'util';
import { readFile } from 'fs-extra';
import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { codegenPackageName, commonPrompts } from '../../../messages';
import { copyTemplateFiles, dedupArr } from '../../../utils';
import { writeCodegenConfig } from '../utils';
import { templates, TemplateType } from '../../../constants';

export const updateCodegenConfig: ListrTask<ListrContext> = {
  title: `Updating ${codegenPackageName} config.`,
  options: { persistentOutput: true, bottomBar: true },
  skip: ({ codegen }) => {
    if (!codegen?.config) return `No ${codegenPackageName} config found. Creating config...`;
    return false;
  },
  task: async (ctx, task) => {
    if (!ctx.codegen) return;

    const { generation, file } = ctx.codegen;
    const config = Object.assign({}, ctx.codegen.config);
    const { clientPreset, legacy, introspection } = generation;

    if (clientPreset) {
      const plugins = [
        ...((clientPreset?.plugins as any[])?.filter((plugin) => plugin !== 'typescript') ?? []),
        '@apollo-mock-operations/codegen-plugin',
      ];

      config.generates = {
        ...config.generates,
        [clientPreset.outputPath]: {
          ...clientPreset.config,
          plugins: dedupArr(plugins),
        },
      };
    }

    if (!clientPreset && legacy) {
      const plugins = [
        ...((legacy.plugins as any[]) ?? []),
        '@apollo-mock-operations/codegen-plugin',
      ];

      config.generates = {
        ...config.generates,
        [legacy.outputPath]: {
          ...legacy.config,
          plugins: dedupArr(plugins),
        },
      };
    }

    if (!clientPreset && !legacy && ctx.useTS) {
      const generationPath = await task.prompt(commonPrompts.generationPath);

      config.generates = {
        ...config.generates,
        [generationPath]: {
          preset: 'client',
          plugins: ['@apollo-mock-operations/codegen-plugin'],
        },
      };
    }

    if (!introspection) {
      const introspectionPath = await task.prompt(commonPrompts.introspectionPath);

      config.generates = {
        ...config.generates,
        [introspectionPath]: {
          plugins: ['introspection'],
        },
      };

      ctx.codegen.generation = {
        ...ctx.codegen.generation,
        introspection: {
          outputPath: introspectionPath,
          config: { plugins: ['introspection'] },
          plugins: ['introspection'],
        },
      };
    }

    const { pkgJson } = ctx;
    let scriptName =
      Object.keys(pkgJson.scripts ?? {}).find(
        (script) => pkgJson.scripts?.[script]?.includes('graphql-codegen')
      ) ?? '';

    if (!scriptName) {
      scriptName = await task.prompt<string>(commonPrompts.scriptName);
      if (!scriptName) throw new Error('The script name is required');
    }

    ctx.codegen.scriptName = scriptName;

    let configStr;
    if (file.ext === '.ts' || file.ext === '.js') {
      const newConfig = inspect(config, {
        showHidden: false,
        compact: false,
        depth: null,
      });

      let templateType: TemplateType = 'ts';
      let template: keyof typeof templates = 'codegenNoConfig';

      if (file.ext === '.js') {
        templateType = 'js';
        template = 'codegenNoConfigJS';
      }
      await copyTemplateFiles(template, templateType, `${file.name}${file.ext}`);

      const fileData = await readFile(file.fullpath);
      configStr = fileData.toString();
      configStr = configStr.replace(/{}/g, newConfig);
    } else if (file.ext === '.json') {
      configStr = JSON.stringify(config, null, 2);
    } else {
      const yaml = await import('yaml').then((m) => m);
      configStr = yaml.stringify(config);
    }

    await writeCodegenConfig(file.fullpath, configStr, `${file.name}${file.ext}`, scriptName);

    ctx.codegen.config = config;
  },
};
