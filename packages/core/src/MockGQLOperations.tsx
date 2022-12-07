import * as React from 'react';
import { ApolloError, ApolloProvider } from '@apollo/client';
import { mergeResolvers } from '@graphql-tools/merge';
import type { IResolvers } from '@graphql-tools/utils';
import type { IntrospectionQuery } from 'graphql';
import type { IntrospectionObjectType } from 'graphql/utilities/getIntrospectionQuery';
import { OperationModel } from './OperationModel';
import type { CreateApolloClient } from './utils';
import type {
  AnyObject,
  CreateOperationState,
  MockProviderProps,
  NonEmptyArray,
  OperationFn,
  OperationState,
  OperationStateObject,
  ProtectedMockedProviderProps,
  ResolverFn,
  ResolverReturnType,
} from './types';
import {
  createApolloClient,
  createLoadingApolloClient,
  generateOperationLoadingError,
} from './utils';

interface MockGQLOperationsCreate<TQueryOperations, TMutationOperations> {
  Query: TQueryOperations;
  Mutation: TMutationOperations;
}

interface MockGQLOperationType<TOperationState> {
  operations?: {
    query: OperationFn<TOperationState, AnyObject, AnyObject>[];
    mutation?: OperationFn<TOperationState, AnyObject, AnyObject>[];
  };
}

interface MockGQLOperationsConfig {
  introspectionResult: IntrospectionQuery | any;
}

export interface MockGQLOperationsType<
  TOperationState extends Record<'state', OperationState<any, any>>,
  TModels extends Record<'models', OperationModel<any>>
> {
  state: TOperationState;
  models?: TModels;
}

export class MockGQLOperations<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
  private readonly introspectionResult: MockGQLOperationsConfig['introspectionResult'];
  private _models: TMockGQLOperations['models'] = {};
  private _operations: MockGQLOperationType<TMockGQLOperations['state']>['operations'] = {
    mutation: [],
    query: [],
  };

  constructor({ introspectionResult }: MockGQLOperationsConfig) {
    this.introspectionResult = introspectionResult;
  }

  get operations(): MockGQLOperationType<TMockGQLOperations['state']>['operations'] {
    return this._operations;
  }

  get models(): TMockGQLOperations['models'] {
    return this._models;
  }

  createProvider =
    (): React.FC<MockProviderProps<TMockGQLOperations['state'], TMockGQLOperations['models']>> =>
    ({ children, Provider = ApolloProvider, loading, ...props }) => {
      const client = React.useMemo(() => {
        if (loading) {
          return createLoadingApolloClient();
        }
        return createApolloClient(this.generateProviderProps(props));
      }, [props.operationState, props.clientOptions, props.cacheOptions, props.delay, loading]);
      return <Provider client={client}>{children}</Provider>;
    };

  createModel = <K extends keyof TMockGQLOperations['state']['operation']>(
    name: K,
    data: NonEmptyArray<ResolverReturnType<TMockGQLOperations['state']['operation'][K]>>
  ): void => {
    this._models = {
      ...this._models,
      [name]: new OperationModel<TMockGQLOperations['state']['operation']>(data),
    };
  };

  queryOperation = <K extends keyof TMockGQLOperations['state']['operation']>(
    name: K,
    state: CreateOperationState<
      TMockGQLOperations['state']['operation'][K],
      TMockGQLOperations['state']['state'][K],
      TMockGQLOperations['models']
    >
  ): void => {
    const operation = this.createOperation(name, state);
    if (this._operations) {
      this._operations.query = [...((this._operations.query as any) ?? []), operation];
    }
  };

  mutationOperation = <K extends keyof TMockGQLOperations['state']['operation']>(
    name: K,
    state: CreateOperationState<
      TMockGQLOperations['state']['operation'][K],
      TMockGQLOperations['state']['state'][K],
      TMockGQLOperations['models']
    >
  ): void => {
    const operation = this.createOperation(name, state);
    if (this._operations) {
      this._operations.mutation = [...((this._operations.mutation as any) ?? []), operation];
    }
  };

  private createOperation =
    <K extends keyof TMockGQLOperations['state']['operation']>(
      name: K,
      state: CreateOperationState<
        TMockGQLOperations['state']['operation'][K],
        TMockGQLOperations['state']['state'][K],
        TMockGQLOperations['models']
      >
    ): OperationFn<
      TMockGQLOperations['state']['state'],
      any,
      Parameters<TMockGQLOperations['state']['operation'][K]>
    > =>
    (scenario: Record<K, TMockGQLOperations['state']['state'][K]>) => ({
      [name]: (
        parent: Parameters<TMockGQLOperations['state']['operation'][K]>[0],
        variables: Parameters<TMockGQLOperations['state']['operation'][K]>[1],
        context: Parameters<TMockGQLOperations['state']['operation'][K]>[2],
        info: Parameters<TMockGQLOperations['state']['operation'][K]>[3]
      ): ReturnType<ResolverFn<any, any, any, any>> => {
        const currentState = scenario[name] ? scenario[name] : 'SUCCESS';
        const currentStateArray: NonEmptyArray<
          OperationStateObject<
            TMockGQLOperations['state']['state'][K],
            ReturnType<TMockGQLOperations['state']['operation'][K]>,
            TMockGQLOperations['models']
          >
        > = typeof state === 'function' ? state(parent, variables, context, info) : state;

        const currentStateObj = [...currentStateArray].find((s) => s.state === currentState);
        if (!currentStateObj) {
          // @ts-ignore
          throw new Error(`${name} operation: unable to match state`);
        }

        const { result } = currentStateObj;
        const { loading, graphQLErrors, networkError } = result ?? ({} as any);
        if (loading) {
          return generateOperationLoadingError();
        }

        if (graphQLErrors) {
          return new ApolloError({ graphQLErrors });
        }

        if (networkError) {
          return new ApolloError({ networkError });
        }

        return typeof result === 'function' ? (result as any)(this._models) : result;
      },
    });

  private generateProviderProps = ({
    operationState,
    mergeOperations,
    delay,
    onResolved,
    ...rest
  }: MockProviderProps<TMockGQLOperations['state'], TMockGQLOperations['models']> &
    ProtectedMockedProviderProps): CreateApolloClient => ({
    mocks: {
      delay,
      introspectionResult: this.introspectionResult,
      onResolved,
      resolvers: mergeOperations
        ? this.mergeOperations(
            typeof mergeOperations === 'function' ? mergeOperations(this._models) : mergeOperations,
            operationState
          )
        : this.createOperations(operationState),
    },
    ...rest,
  });

  private mapOperations = (
    operations: OperationFn<TMockGQLOperations['state'], any, any>[],
    state?: TMockGQLOperations['state']
  ): MockGQLOperationsCreate<any, any> => {
    const defaultState = (state ?? {}) as TMockGQLOperations['state'];

    return operations.reduce<MockGQLOperationsCreate<any, any>>((operationObj, operation) => {
      const key = Object.keys(
        operation({} as TMockGQLOperations['state'])
      )[0] as keyof TMockGQLOperations['state'];
      const operationState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};

      operationObj[key as keyof MockGQLOperationsCreate<any, any>] = operation(
        operationState as unknown as TMockGQLOperations['state']
      )[key];

      return operationObj;
    }, {} as MockGQLOperationsCreate<any, any>);
  };

  private generateResolverKey = (key: keyof MockGQLOperationType<any>['operations']): string =>
    (key as string).charAt(0).toUpperCase() + (key as string).slice(1);

  private createOperations = (state?: TMockGQLOperations['state']): IResolvers =>
    [this._operations ?? []].reduce<IResolvers>((operationObj, operation) => {
      const keys = Object.keys(operation);
      for (const key of keys as (keyof typeof operation)[]) {
        operationObj[this.generateResolverKey(key)] = this.mapOperations(
          this._operations?.[key] ?? [],
          state
        );
      }
      return operationObj;
    }, {});

  private mergeOperations(
    operations: Partial<TMockGQLOperations['state']['operation']>,
    operationState?: MockProviderProps<
      TMockGQLOperations['state'],
      TMockGQLOperations['models']
    >['operationState']
  ): IResolvers {
    const rootResolverTypes = (
      this.introspectionResult as IntrospectionQuery
    ).__schema.types.filter((type) => type.name === 'Mutation' || type.name === 'Query');

    const customOperations = Object.keys(operations).reduce<IResolvers>((acc, operationName) => {
      const resolverRootKey = rootResolverTypes.find((resolverType) =>
        (resolverType as IntrospectionObjectType).fields.find(
          (field) => field.name === operationName
        )
      )?.name;

      if (resolverRootKey) {
        (acc as any)[resolverRootKey] = {
          ...acc[resolverRootKey],
          [operationName]: operations?.[operationName],
        };
      }
      return acc;
    }, {});

    const defaultOperations = this.createOperations(operationState);

    return mergeResolvers([defaultOperations, customOperations]);
  }
}
