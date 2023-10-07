import { join, parse, relative } from 'path';
import { readFile, writeFile } from 'fs-extra';
import chalk from 'chalk';
import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { copyTemplateFiles } from '../../../utils';
import { templates } from '../../../constants';

const TEMPLATES = [
  {
    templateName: 'builderJS',
    outpathFile: 'builder.ts',
  },
  {
    templateName: 'builderIndexJS',
    outpathFile: 'index.ts',
  },
] as const;

export const setupJSCoreFiles: ListrTask<ListrContext> = {
  title: 'Setting up core project files.',
  enabled: ({ useTS }) => !useTS,
  task: async (ctx, task) => {
    const { generation } = ctx.codegen ?? {};

    const outputBasePath = await task.prompt({
      type: 'Input',
      message: 'Where would you to setup the core files?',
      initial: 'src/mocking/',
    });

    let introspectionMeta: Record<string, any> | undefined;

    if (generation?.introspection) {
      const introspectionPath = generation.introspection.outputPath;
      const introspectionFullPath = join(process.cwd(), introspectionPath);
      const { dir, name, ext } = parse(introspectionFullPath);
      introspectionMeta = { path: dir, fileName: name, ext };
    }

    if (!introspectionMeta) {
      throw new Error('Output path not found.');
    }

    for (const template of TEMPLATES) {
      const outputPath = join(outputBasePath, template.outpathFile);
      await copyTemplateFiles(template.templateName, 'js', outputPath);
    }

    const builderFileDir = join(outputBasePath, templates.builderJS);
    const filePath = join(process.cwd(), builderFileDir);
    const fileData = await readFile(filePath);
    let fileAsString = fileData.toString('utf-8');

    const fullPath = join(process.cwd(), outputBasePath);
    const relativeIntrospectionPath = relative(fullPath, introspectionMeta.path);
    const fullPathWithFileName = relativeIntrospectionPath
      ? join(relativeIntrospectionPath, `${introspectionMeta.fileName}${introspectionMeta.ext}`)
      : `./${introspectionMeta.fileName}${introspectionMeta.ext}`;
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
