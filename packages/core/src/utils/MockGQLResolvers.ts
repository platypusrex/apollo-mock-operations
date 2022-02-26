import { mergeResolvers as mergeGQLResolvers } from '@graphql-tools/merge';

type AnyObject = Record<string, unknown>;
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

type QueryType<TState, TReturn> = (state: TState) => TReturn;

interface MockGQLResolverConfig<TQueryResolvers, TMutationResolvers, TResolverState> {
  resolvers: {
    query: QueryType<TResolverState, TQueryResolvers>[];
    mutation: QueryType<TResolverState, TMutationResolvers>[];
  };
}

interface MockGQLResolverCreate<TQueryResolvers, TMutationResolvers> {
  Query: () => TQueryResolvers;
  Mutation: () => TMutationResolvers;
}

type MockGQLResolverMerge<TQueryResolvers, TMutationResolvers> = RequireAtLeastOne<{
  query: TQueryResolvers;
  mutation: TMutationResolvers;
}>;

export class MockGQLResolvers<TQueryResolvers, TMutationResolvers, TResolverState = AnyObject> {
  private readonly resolvers: MockGQLResolverConfig<
    TQueryResolvers,
    TMutationResolvers,
    TResolverState
  >['resolvers'];
  constructor({
    resolvers,
  }: MockGQLResolverConfig<TQueryResolvers, TMutationResolvers, TResolverState> = { resolvers: { query: [], mutation: [] } } ) {
    this.resolvers = resolvers;
  }

  private mapResolvers = (
    resolvers: QueryType<TResolverState, TQueryResolvers | TMutationResolvers>[],
    state?: TResolverState
  ) => {
    const defaultState = (state || {}) as TResolverState;
    return resolvers.reduce((acc, curr) => {
      const copy = curr;
      const key = Object.keys(copy({} as TResolverState))[0] as keyof TResolverState;
      const resolverState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};
      // @ts-ignore
      acc[key] = curr(resolverState)[key];
      return acc;
    }, {});
  };

  create = (state?: TResolverState): MockGQLResolverCreate<TQueryResolvers, TMutationResolvers> =>
    ({
      Query: () => this.mapResolvers(this.resolvers.query, state),
      Mutation: () => this.mapResolvers(this.resolvers.mutation, state),
    } as MockGQLResolverCreate<TQueryResolvers, TMutationResolvers>);

  merge = ({
    query,
    mutation,
  }: MockGQLResolverMerge<TQueryResolvers, TMutationResolvers>): MockGQLResolverCreate<
    TQueryResolvers,
    TMutationResolvers
  > => {
    const defaultResolvers = this.create();
    const { Query, Mutation } = defaultResolvers || {};

    const customResolvers = [query, mutation].reduce((root, resolvers, i) => {
      if (Object.keys(resolvers || {}).length) {
        const res = i === 0 ? Query : Mutation;
        (root as any)[i === 0 ? 'Query' : 'Mutation'] = () => ({ ...(res ? res() : {}), ...resolvers });
      }
      return root;
    }, {});

    if (!Object.keys(customResolvers).length) {
      return defaultResolvers as MockGQLResolverCreate<TQueryResolvers, TMutationResolvers>;
    }

    // @ts-ignore
    return mergeGQLResolvers([defaultResolvers, customResolvers]);
  };
}
