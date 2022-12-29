import type { IResolvers } from '@graphql-tools/utils';
import type { IntrospectionQuery } from 'graphql';
import type { OperationMeta } from './shared';

export interface CreateLinkOptions {
  delay?: number;
  onResolved?: (operationMeta: OperationMeta) => void;
  loading?: boolean;
}

export interface LinkSchemaProps extends CreateLinkOptions {
  resolvers: IResolvers;
  introspectionResult: IntrospectionQuery | any;
  rootValue?: any;
  context?: any;
}
