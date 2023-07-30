import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { mergeResolvers } from '@graphql-tools/merge';
import type { IResolvers } from '@graphql-tools/utils';
import type { IntrospectionQuery } from 'graphql';
import { GraphQLError } from 'graphql';
import type { IntrospectionObjectType } from 'graphql/utilities/getIntrospectionQuery';
import { OperationModels } from './OperationModels';
import { getDevToolsComponent } from './dev-tools';
import type { MockedDevtoolsProps } from './dev-tools/types';
import { createApolloClient, createLoadingApolloClient, createMockApolloLink } from './utils';
import type { CreateApolloClient } from './utils';
import { LOADING_ERROR_CODE, NETWORK_ERROR_CODE } from './constants';
import type {
  CreateOperationState,
  MergeResolversType,
  MockGQLOperationMap,
  MockGQLOperationType,
  MockGQLOperationsCreate,
  MockGQLOperationsConfig,
  MockGQLOperationsType,
  MockProviderProps,
  NonEmptyArray,
  OperationFn,
  OperationModelsType,
  OperationStatePayload,
  ProtectedMockedProviderProps,
  RequireAtLeastOne,
  ResolverFn,
  MockModelsType,
} from './types';

export class MockGQLOperations<
  TMockGQLOperations extends MockGQLOperationsType,
  TModels extends MockModelsType
> {
  private readonly introspectionResult: MockGQLOperationsConfig['introspectionResult'];
  private readonly enableDevTools?: boolean;
  private readonly defaultOperationState?: string;
  private readonly _modelsInstance: OperationModels<TModels>;
  private _models: OperationModelsType<TModels> = {} as OperationModelsType<TModels>;
  private _operations: MockGQLOperationType<TMockGQLOperations>['operations'] = {
    mutation: [],
    query: [],
  };
  private _operationMap: MockGQLOperationMap<TMockGQLOperations> = {
    mutation: [],
    query: [],
  };

  constructor({
    introspectionResult,
    enableDevTools,
    defaultOperationState,
  }: MockGQLOperationsConfig) {
    this.introspectionResult = introspectionResult;
    this.enableDevTools = enableDevTools;
    this.defaultOperationState = defaultOperationState;
    this._modelsInstance = OperationModels.getInstance();
  }

  get operations(): MockGQLOperationType<TMockGQLOperations>['operations'] {
    return this._operations;
  }

  get models(): OperationModelsType<TModels> {
    const { models } = this._modelsInstance;
    return models;
  }

  createDevtools = (): React.FC<
    Omit<MockedDevtoolsProps, 'operationMap' | 'defaultOperationState'>
  > => {
    return getDevToolsComponent<MockGQLOperationMap<TMockGQLOperations>>({
      operations: this._operationMap,
      introspection: this.introspectionResult,
      defaultOperationState: this.defaultOperationState,
      enabled: this.enableDevTools,
    });
  };

  createMockLink = () => {
    return createMockApolloLink({
      mocks: { introspectionResult: this.introspectionResult, resolvers: {} },
      createOperations: this.createOperations,
      enabled: this.enableDevTools,
    });
  };

  createProvider =
    (): React.FC<MockProviderProps<TMockGQLOperations, OperationModelsType<TModels>>> =>
    ({ children, Provider = ApolloProvider, loading, ...props }) => {
      const client = React.useMemo(() => {
        if (loading) {
          return createLoadingApolloClient();
        }
        return createApolloClient(this.generateProviderProps(props));
      }, [props.operationState, props.clientOptions, props.cacheOptions, props.delay, loading]);
      return <Provider client={client}>{children}</Provider>;
    };

  createModel = <K extends keyof TModels>(name: K, data: NonEmptyArray<TModels[K]>): void => {
    const modelData = this._modelsInstance.createModel(name, data);
    this._models = {
      ...this._models,
      ...modelData,
    };
  };

  query = <K extends keyof TMockGQLOperations['Query']>(
    name: K,
    options: CreateOperationState<
      TMockGQLOperations['Query'][K]['resolver'],
      TMockGQLOperations['Query'][K]['state'],
      OperationModelsType<TModels>
    >
  ): void => {
    const operation = this.createOperation(name, options);
    // @ts-ignore
    this._operationMap.query = [...this._operationMap.query, { [name]: options }];

    if (this._operations) {
      this._operations.query = [...((this._operations.query as any) ?? []), operation];
    }
  };

  mutation = <K extends keyof TMockGQLOperations['Mutation']>(
    name: K,
    options: CreateOperationState<
      TMockGQLOperations['Mutation'][K]['resolver'],
      TMockGQLOperations['Mutation'][K]['state'],
      OperationModelsType<TModels>
    >
  ): void => {
    const operation = this.createOperation(name, options);
    // @ts-ignore
    this._operationMap.mutation = [...this._operationMap.mutation, { [name]: options }];

    if (this._operations) {
      this._operations.mutation = [...((this._operations.mutation as any) ?? []), operation];
    }
  };

  private createOperation =
    <K extends keyof TMockGQLOperations['Query' | 'Mutation']>(
      name: K,
      options: CreateOperationState<
        TMockGQLOperations['Query' | 'Mutation'][K]['resolver'],
        TMockGQLOperations['Query' | 'Mutation'][K]['state'],
        OperationModelsType<TModels>
      >
    ) =>
    (scenario: Record<K, TMockGQLOperations['Query' | 'Mutation'][K]['state']>) => ({
      [name]: (...args: any): ReturnType<ResolverFn<any, any, any, any>> => {
        const { defaultState, resolver } = options;
        const currentState = scenario[name]
          ? scenario[name]
          : defaultState
          ? defaultState
          : this.defaultOperationState;

        const currentStateArray: OperationStatePayload<
          TMockGQLOperations['Query' | 'Mutation'][K]['resolver'],
          ReturnType<TMockGQLOperations['Query' | 'Mutation'][K]['resolver']>,
          OperationModelsType<TModels>
        > = typeof resolver === 'function' ? resolver(...args) : resolver;

        const currentStateObj = currentStateArray[currentState as keyof typeof currentStateArray];

        if (!currentStateObj) {
          throw new Error(`${String(name)} operation: unable to match state`);
        }

        const { variant } = currentStateObj;

        switch (variant) {
          case 'data':
            const { data } = currentStateObj;
            return typeof data === 'function' ? data(this._models) : data;
          case 'loading':
            throw new GraphQLError('loading', {
              extensions: { code: LOADING_ERROR_CODE },
            });
          case 'graphql-error':
            const { error: gqlError } = currentStateObj;
            if (gqlError) {
              throw typeof gqlError === 'function' ? gqlError(this._models) : gqlError;
            } else {
              throw new GraphQLError('GraphQL error');
            }
          case 'network-error':
            const { error } = currentStateObj;
            const networkError = typeof error === 'function' ? error(this._models) : error;
            throw new GraphQLError(networkError?.message ?? 'Network error', {
              extensions: { code: NETWORK_ERROR_CODE },
            });
          default:
            console.error(`Invalid operation variant provide - ${variant}`);
        }
      },
    });

  private generateProviderProps = ({
    operationState,
    mergeOperations,
    delay,
    onResolved,
    ...rest
  }: MockProviderProps<TMockGQLOperations, OperationModelsType<TModels>> &
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
        : this.createOperations(
            operationState as Partial<TMockGQLOperations['Query' | 'Mutation']['state']>
          ),
    },
    ...rest,
  });

  private mapOperations = (
    operations: OperationFn<TMockGQLOperations['Query' | 'Mutation']['state'], any, any>[],
    state?: TMockGQLOperations['Query' | 'Mutation']['state']
  ): MockGQLOperationsCreate<any, any> => {
    const defaultState = (state ?? {}) as TMockGQLOperations['Query' | 'Mutation']['state'];

    return operations.reduce<MockGQLOperationsCreate<any, any>>((operationObj, operation) => {
      const key = Object.keys(
        operation({} as TMockGQLOperations['Query' | 'Mutation']['state'])
      )[0] as keyof TMockGQLOperations['Query' | 'Mutation']['state'];
      const operationState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};

      operationObj[key as keyof MockGQLOperationsCreate<any, any>] = operation(
        operationState as unknown as TMockGQLOperations['Query' | 'Mutation']['state']
      )[key];

      return operationObj;
    }, {} as MockGQLOperationsCreate<any, any>);
  };

  private generateResolverKey = (key: keyof MockGQLOperationType<any>['operations']): string =>
    (key as string).charAt(0).toUpperCase() + (key as string).slice(1);

  private createOperations = (
    state?: Partial<TMockGQLOperations['Query' | 'Mutation']['state']>
  ): IResolvers =>
    [this._operations ?? []].reduce<IResolvers>((operationObj, operation) => {
      const keys = Object.keys(operation);
      for (const key of keys as (keyof typeof operation)[]) {
        operationObj[this.generateResolverKey(key)] = this.mapOperations(
          this._operations?.[key] ?? [],
          state as any
        );
      }
      return operationObj;
    }, {});

  private mergeOperations(
    operations: RequireAtLeastOne<MergeResolversType<TMockGQLOperations>>,
    operationState?: MockProviderProps<
      TMockGQLOperations,
      OperationModelsType<TModels>
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

    const defaultOperations = this.createOperations(
      operationState as Partial<TMockGQLOperations['Query' | 'Mutation']['state']>
    );

    return mergeResolvers([defaultOperations, customOperations]);
  }
}
