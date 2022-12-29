import { OperationModel } from '../OperationModel';
import type { Maybe } from '@graphql-tools/utils';
import type { GraphqlError, NetworkError, OperationLoading, OperationType } from './shared'
import type { AnyObject, OmitNonPrimitive, RequireAtLeastOne } from './utility';

export type OperationModelType<TMockOperation extends OperationType<any, any>> = Record<
  keyof TMockOperation,
  OperationModel<TMockOperation>
>;

export type ResolverReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
  ) => infer R
  ? R extends GraphqlError | NetworkError | OperationLoading | Promise<any>
    ? never
    : NonNullable<R>
  : never;

export type WhereQuery<T extends OperationType<any, any>> = {
  where: RequireAtLeastOne<
    OmitNonPrimitive<
      {
        [K in keyof Omit<ResolverReturnType<T[keyof T]>, '__typename'>]: ResolverReturnType<
        T[keyof T]
      >[K];
      },
      Maybe<any[] | AnyObject>
    >
  >;
};
