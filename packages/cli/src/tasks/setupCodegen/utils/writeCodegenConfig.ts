import { writeFile } from 'fs-extra';
import chalk from 'chalk';
import { writeToPkgJson } from '../../../utils';

export const writeCodegenConfig = async (
  filePath: string,
  configString: string,
  configFileName: string,
  scriptName?: string
) => {
  try {
    await writeFile(filePath, configString, 'utf-8');
  } catch (e) {
    throw new Error(`Error creating ${chalk.blueBright(`${configFileName}.ts`)} config file.`);
  }

  if (scriptName) {
    writeToPkgJson((pkgJson) => {
      if (pkgJson.scripts) {
        pkgJson.scripts[scriptName] = `graphql-codegen --config ${configFileName}`;
      } else {
        pkgJson.scripts = {
          [scriptName]: `graphql-codegen --config ${configFileName}`,
        };
      }
      return pkgJson;
    });
  }
};
