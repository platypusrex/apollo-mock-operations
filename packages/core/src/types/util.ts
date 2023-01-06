export type AnyObject<T = any> = Record<string, T>;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

type ExtractReturnTypeKeysByValue<T, V> = { [K in keyof T]-?: T[K] extends V ? never : K }[keyof T];
export type OmitNonPrimitive<T, V> = Pick<T, ExtractReturnTypeKeysByValue<T, V>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;
