import { join, parse } from 'path';
import { copyFile, mkdir, pathExists } from 'fs-extra';
import { templates } from '../constants';
import { getTemplatesDir } from './getTemplatesDir';

export const copyTemplateFiles = async (
  template: keyof typeof templates,
  fileName: string
): Promise<void> => {
  try {
    const fullPath = join(process.cwd(), fileName);
    const { dir } = parse(fullPath);

    const exists = await pathExists(dir);
    if (!exists) {
      await mkdir(dir, { recursive: true });
    }

    const templateDirectory = await getTemplatesDir(template);
    await copyFile(templateDirectory, join(process.cwd(), fileName));
  } catch (e) {
    throw new Error(`Failed to copy project template: ${e}`);
  }
};
