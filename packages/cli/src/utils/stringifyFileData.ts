import { readFile } from 'fs-extra';

export const stringifyFileData = async (filePath: string) => {
  try {
    const fileData = await readFile(filePath);
    return fileData.toString('utf-8');
  } catch (e) {
    throw new Error(`Error generated stringified file data: ${e}`);
  }
};
