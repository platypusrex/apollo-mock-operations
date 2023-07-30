import type { IResolvers } from '@graphql-tools/utils';
import type { IntrospectionQuery } from 'graphql';
import type { OperationMeta } from './shared';

export type CreateLinkOptions = {
  delay?: number;
  onResolved?: (operationMeta: OperationMeta) => void;
  loading?: boolean;
};

export type LinkSchemaProps = CreateLinkOptions & {
  resolvers: IResolvers;
  introspectionResult: IntrospectionQuery | any;
  rootValue?: any;
  context?: any;
}
