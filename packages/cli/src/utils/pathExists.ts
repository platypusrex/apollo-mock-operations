import { promises } from 'fs';

export const pathExists = async (path: string) => {
  try {
    await promises.access(path);
    return true;
  } catch (e) {
    return false;
  }
};
