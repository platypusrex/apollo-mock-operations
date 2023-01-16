export type OperationMap = {
  query: Record<string, string[]>[];
  mutation: Record<string, string[]>[];
};

export type MockedDevtoolsProps = {
  operationMap: OperationMap;
  defaultOperationState: string;
};

export type OperationSessionState = {
  query: Record<string, string>;
  mutation: Record<string, string>;
};
