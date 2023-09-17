import { resolve } from 'path';
import type { ListrTask } from 'listr2';
import type { ListrContext } from '../../../types';
import { copyTemplateFiles, stringifyFileData } from '../../../utils';
import { codegenPackageName, commonPrompts } from '../../../messages';
import { writeCodegenConfig } from '../utils';
import { checkForCodegenConfig } from './checkForCodegenConfig';
import { getCodegenConfigMeta } from './getCodegenConfigMeta';

export const createJSCodegenConfig: ListrTask<ListrContext> = {
  title: `Creating ${codegenPackageName} config.`,
  options: { persistentOutput: true, bottomBar: true },
  enabled: ({ useTS }) => !useTS,
  skip: ({ codegen }) => {
    if (!!codegen?.config) {
      return `${codegenPackageName} config already updating. Skipping...`;
    }
    return false;
  },
  task: async (ctx, task) =>
    task.newListr([
      {
        title: 'Building config from input.',
        task: async () => {
          const schema = await task.prompt<string>(commonPrompts.schema);
          const introspectionPath = await task.prompt<string>(commonPrompts.introspectionPath);
          const configFileName = await task.prompt<string>(commonPrompts.configFileName);
          const scriptName = await task.prompt<string>(commonPrompts.scriptName);

          if (ctx.codegen) ctx.codegen.scriptName = scriptName;

          await copyTemplateFiles('codegenIntrospection', configFileName);
          const filePath = resolve(process.cwd(), configFileName);

          let configStr = await stringifyFileData(filePath);
          configStr = configStr.replace(/<codegen-schema>/g, schema);
          configStr = configStr.replace(/<codegen-introspection-location>/g, introspectionPath);

          await writeCodegenConfig(filePath, configStr, configFileName, scriptName);
        },
      },
      checkForCodegenConfig,
      getCodegenConfigMeta,
    ]),
};
