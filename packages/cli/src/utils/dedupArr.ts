export const dedupArr = <T extends any[]>(arr: T): T => {
  return Array.from(new Set(arr)) as T;
};
