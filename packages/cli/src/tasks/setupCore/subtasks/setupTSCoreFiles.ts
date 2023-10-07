import { join, parse, relative } from 'path';
import { readFile, writeFile } from 'fs-extra';
import chalk from 'chalk';
import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { copyTemplateFiles } from '../../../utils';
import { templates } from '../../../constants';

const TEMPLATES = [
  {
    templateName: 'builderTS',
    outpathFile: 'builder.ts',
  },
  {
    templateName: 'builderIndexTS',
    outpathFile: 'index.ts',
  },
] as const;

export const setupTSCoreFiles: ListrTask<ListrContext> = {
  title: 'Setting up core project files.',
  enabled: ({ useTS }) => useTS,
  task: async (ctx, task) => {
    const { generation } = ctx.codegen ?? {};

    const outputBasePath = await task.prompt({
      type: 'Input',
      message: 'Where would you to setup the core files? (must be a directory)',
      initial: 'src/mocking/',
      validate: (val) => {
        const { ext } = parse(val);
        return !ext;
      },
    });

    let typesMeta: Record<string, any> | undefined;
    let introspectionMeta: Record<string, any> | undefined;

    if (generation?.clientPreset) {
      const clientPresetPath = generation.clientPreset.outputPath;
      const clientPresetFullPath = join(process.cwd(), clientPresetPath);
      const { dir, name, ext } = parse(clientPresetFullPath);

      if (!ext) {
        typesMeta = { path: clientPresetFullPath, fileName: 'graphql', ext: '.ts' };
      } else {
        typesMeta = { path: dir, fileName: name, ext };
      }
    }

    if (generation?.legacy) {
      const clientPresetPath = generation.legacy.outputPath;
      const clientPresetFullPath = join(process.cwd(), clientPresetPath);

      const { dir, name, ext } = parse(clientPresetFullPath);
      typesMeta = { path: dir, fileName: name, ext };
    }

    if (generation?.introspection) {
      const introspectionPath = generation.introspection.outputPath;
      const introspectionFullPath = join(process.cwd(), introspectionPath);
      const { dir, name, ext } = parse(introspectionFullPath);
      introspectionMeta = { path: dir, fileName: name, ext };
    }

    if (!typesMeta || !introspectionMeta) {
      throw new Error('Output path not found.');
    }

    for (const template of TEMPLATES) {
      const outputPath = join(outputBasePath, template.outpathFile);
      await copyTemplateFiles(template.templateName, 'ts', outputPath);
    }

    const builderFileDir = join(outputBasePath, templates.builderTS);
    const filePath = join(process.cwd(), builderFileDir);
    const fileData = await readFile(filePath);
    let fileAsString = fileData.toString('utf-8');

    const fullPath = join(process.cwd(), outputBasePath);
    const relativeTypesPath = relative(fullPath, typesMeta.path);
    const relativeIntrospectionPath = relative(fullPath, introspectionMeta.path);
    const fullPathWithFileName = relativeIntrospectionPath
      ? join(relativeIntrospectionPath, `${introspectionMeta.fileName}${introspectionMeta.ext}`)
      : `./${introspectionMeta.fileName}${introspectionMeta.ext}`;
    fileAsString = fileAsString.replace(
      /<operation-type-path>/g,
      join(relativeTypesPath, typesMeta.fileName)
    );
    fileAsString = fileAsString.replace(/<introspection-path>/g, fullPathWithFileName);

    try {
      await writeFile(join(process.cwd(), builderFileDir), fileAsString, 'utf-8');
    } catch (e) {
      throw new Error(
        `Error creating ${chalk.blueBright('@apollo-mock-operations')} builder file.`
      );
    }
  },
};
