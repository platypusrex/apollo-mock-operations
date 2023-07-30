import { OperationModel } from '../OperationModel';
import type { Maybe } from '@graphql-tools/utils';
import type { GraphqlError, NetworkError, OperationLoading, OperationType } from './shared'
import type { AnyObject, OmitNonPrimitive, RequireAtLeastOne } from './util';
import type { MockModelsType } from './operationMock';

export type OperationModelType<TMockOperation extends OperationType<any, any>> = Record<
  keyof TMockOperation,
  OperationModel<TMockOperation>
>;

export type OperationModelsType<TModel extends MockModelsType> = {
  [K in keyof TModel]: OperationModel<TModel[K]>
}

export type ResolverReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
  ) => infer R
  ? R extends GraphqlError | NetworkError | OperationLoading | Promise<any>
    ? never
    : NonNullable<R>
  : never;

export type WhereQuery<T extends MockModelsType> = {
  where: RequireAtLeastOne<
    OmitNonPrimitive<
      {
        [K in keyof Omit<T, '__typename'>]: T[K];
      },
      Maybe<any[] | AnyObject>
    >
  >;
};
