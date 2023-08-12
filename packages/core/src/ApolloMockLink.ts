import { buildClientSchema, graphql, print } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';
import { ApolloLink, type FetchResult, Observable, type Operation } from '@apollo/client';
import type { IResolvers } from '@graphql-tools/utils';
import type { CreateLinkOptions, LinkSchemaProps } from './types';
import { getCookie } from './dev-tools/hooks';
import { reactiveOperationState } from './nextjs';
import { delay } from './utils/delay';
import { isSSR } from './utils/isSSR';
import { parseJSON } from './utils/parseJSON';
import {
  LOADING_ERROR_CODE,
  NETWORK_ERROR_CODE,
  APOLLO_MOCK_OPERATION_STATE_KEY,
} from './constants';

type ApolloMockLinkConfig<TState = any> = {
  mocks: LinkSchemaProps;
  loading?: boolean;
  createOperations?: (state?: TState) => IResolvers;
};

export class ApolloMockLink extends ApolloLink {
  private readonly mocks: ApolloMockLinkConfig['mocks'];
  private loading: ApolloMockLinkConfig['loading'];
  private readonly createOperations: ApolloMockLinkConfig['createOperations'];
  constructor({ mocks, loading, createOperations }: ApolloMockLinkConfig) {
    super();
    this.mocks = mocks;
    this.loading = loading;
    this.createOperations = createOperations;
  }

  private getOperationState = () => {
    if (!this.createOperations) {
      console.error('getOperationState: missing required createOperation function');
      return;
    }

    let storedOperationState;
    if (!isSSR()) {
      storedOperationState = getCookie(APOLLO_MOCK_OPERATION_STATE_KEY);
    } else {
      storedOperationState = reactiveOperationState();
    }

    let parsedState = {};
    if (storedOperationState) {
      const { query: q, mutation } = parseJSON<any>(storedOperationState) ?? {};
      parsedState = { ...q, ...mutation };
    }

    return this.createOperations(parsedState);
  };

  public request(operation: Operation): Observable<FetchResult> | null {
    const {
      resolvers: mockResolvers,
      introspectionResult,
      rootValue,
      context,
      delay: delayMS,
      onResolved,
    } = this.mocks;

    const mockedOperations = this.createOperations ? this.getOperationState() : mockResolvers;
    const resolvers = Object.keys(mockedOperations ?? {}).reduce<IResolvers>((operation, curr) => {
      if (mockedOperations && Object.keys(mockedOperations[curr]).length) {
        operation[curr] = mockedOperations[curr];
      }
      return operation;
    }, {});

    const schema = buildClientSchema(introspectionResult);
    const mockOptions = { schema, resolvers };
    const schemaWithMocks = addMocksToSchema(mockOptions);

    const apolloLinkOptions: CreateLinkOptions = {};
    if (onResolved) apolloLinkOptions.onResolved = onResolved;

    return new Observable((observer: any) => {
      const { query, operationName, variables } = operation;
      const source = print(query);
      delay(delayMS ?? 0)
        .then(() =>
          graphql({
            schema: schemaWithMocks,
            source,
            rootValue,
            contextValue: context,
            variableValues: variables,
            operationName,
          })
        )
        // @ts-ignore
        .then((result) => {
          onResolved &&
            onResolved({
              operationName,
              variables,
              query: source,
              result,
            });

          const loading = result.errors?.find(
            (error) => error?.extensions?.code === LOADING_ERROR_CODE
          );
          if (loading) {
            return !this?.loading
              ? observer.error(new Error('Loading state not supported in app mock link'))
              : {};
          }

          const networkError = result.errors?.find(
            (error) => error?.extensions?.code === NETWORK_ERROR_CODE
          );

          if (networkError) {
            observer.error(new Error(networkError.message));
          } else {
            observer.next(result);
            observer.complete();
          }
        })
        .catch(observer.error.bind(observer));
    });
  }
}
