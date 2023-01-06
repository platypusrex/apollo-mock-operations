import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { mergeResolvers } from '@graphql-tools/merge';
import type { IResolvers } from '@graphql-tools/utils';
import type { IntrospectionQuery } from 'graphql';
import { GraphQLError } from 'graphql';
import type { IntrospectionObjectType } from 'graphql/utilities/getIntrospectionQuery';
import { OperationModels } from './OperationModels';
import { OperationModel } from './OperationModel';
import { getDevToolsComponent } from './dev-tools';
import type { ApolloMockedDevtools } from './dev-tools/types';
import { createApolloClient, createLoadingApolloClient, createMockApolloLink } from './utils';
import type { CreateApolloClient } from './utils';
import { LOADING_ERROR_CODE, NETWORK_ERROR_CODE } from './constants';
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

interface MockGQLOperationMap<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
  query: Record<
    string,
    CreateOperationState<
      TMockGQLOperations['state']['operation'][string],
      TMockGQLOperations['state']['state'][string],
      TMockGQLOperations['models']
    >
  >[];
  mutation: Record<
    string,
    CreateOperationState<
      TMockGQLOperations['state']['operation'][string],
      TMockGQLOperations['state']['state'][string],
      TMockGQLOperations['models']
    >
  >[];
}

interface MockGQLOperationsConfig {
  introspectionResult: IntrospectionQuery | any;
  enableDevTools?: boolean;
}

export interface MockGQLOperationsType<
  TOperationState extends Record<'state', OperationState<any, readonly string[]>>,
  TModels extends Record<'models', OperationModel<any>>
> {
  state: TOperationState;
  models?: TModels;
}

export class MockGQLOperations<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
  private readonly _modelsInstance: OperationModels<any>;
  private readonly introspectionResult: MockGQLOperationsConfig['introspectionResult'];
  private readonly enableDevTools?: boolean;
  private _models: TMockGQLOperations['models'] = {};
  private _operations: MockGQLOperationType<TMockGQLOperations['state']>['operations'] = {
    mutation: [],
    query: [],
  };
  private _operationMap: MockGQLOperationMap<TMockGQLOperations> = {
    mutation: [],
    query: [],
  };

  constructor({ introspectionResult, enableDevTools }: MockGQLOperationsConfig) {
    this.introspectionResult = introspectionResult;
    this.enableDevTools = enableDevTools;
    this._modelsInstance = OperationModels.getInstance();
  }

  get operations(): MockGQLOperationType<TMockGQLOperations['state']>['operations'] {
    return this._operations;
  }

  get models(): TMockGQLOperations['models'] {
    const { models, _unsafeForceUpdateModelData } = this._modelsInstance;
    return { ...models, _unsafeForceUpdateModelData };
  }

  createDevtools = (): React.FC<Omit<ApolloMockedDevtools, 'operationMap'>> => {
    return getDevToolsComponent({
      operations: this._operationMap,
      introspection: this.introspectionResult,
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
    const modelData = this._modelsInstance.createModel(name, data);
    this._models = {
      ...this._models,
      ...modelData,
    };
  };

  query = <K extends keyof TMockGQLOperations['state']['operation']>(
    name: K,
    state: CreateOperationState<
      TMockGQLOperations['state']['operation'][K],
      TMockGQLOperations['state']['state'][K],
      TMockGQLOperations['models']
    >
  ): void => {
    const operation = this.createOperation(name, state);
    this._operationMap.query = [...this._operationMap.query, { [name]: state }];

    if (this._operations) {
      this._operations.query = [...((this._operations.query as any) ?? []), operation];
    }
  };

  mutation = <K extends keyof TMockGQLOperations['state']['operation']>(
    name: K,
    state: CreateOperationState<
      TMockGQLOperations['state']['operation'][K],
      TMockGQLOperations['state']['state'][K],
      TMockGQLOperations['models']
    >
  ): void => {
    const operation = this.createOperation(name, state);
    this._operationMap.mutation = [...this._operationMap.mutation, { [name]: state }];

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
        const currentStateArray = (
          typeof state === 'function' ? state(parent, variables, context, info) : state
        ) as OperationStateObject<
          TMockGQLOperations['state']['state'][K],
          ReturnType<TMockGQLOperations['state']['operation'][K]>,
          TMockGQLOperations['models']
        >[];

        const currentStateObj = [...currentStateArray].find((s) => s.state === currentState);
        if (!currentStateObj) {
          throw new Error(`${String(name)} operation: unable to match state`);
        }

        const { payload } = currentStateObj;
        const result = typeof payload === 'function' ? payload(this._models) : payload;
        const { variant } = result;

        switch (variant) {
          case 'data':
            return result.data;
          case 'loading':
            throw new GraphQLError('loading', {
              extensions: { code: LOADING_ERROR_CODE },
            });
          case 'graphql-error':
            if (result.error) {
              throw result.error;
            } else {
              throw new GraphQLError('GraphQL error');
            }
          case 'network-error':
            throw new GraphQLError(result.error?.message ?? 'Network error', {
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
