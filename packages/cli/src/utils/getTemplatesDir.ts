import { resolve } from 'path';
import { promises, constants } from 'fs';
import { templates } from '../constants';

export const getTemplatesDir = async (template: keyof typeof templates): Promise<string> => {
  const templateDir = resolve(__dirname, '../../templates', templates[template]);

  try {
    await promises.access(templateDir, constants.R_OK);
    return templateDir;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Invalid template name: ${e.message}`);
    }
    process.exit(1);
  }
};
