export type OperationMap = {
  query: Record<string, string[]>[];
  mutation: Record<string, string[]>[];
};

export type ApolloMockedDevtools = {
  operationMap: OperationMap;
};

export type OperationSessionState = {
  query: Record<string, string>;
  mutation: Record<string, string>;
};
