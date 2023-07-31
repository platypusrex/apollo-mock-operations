type Operation = {
  defaultState: string;
  options: string[]
}

export type OperationMap = {
  query: Record<string, Operation>[];
  mutation: Record<string, Operation>[];
};

export type MockedDevtoolsProps = {
  operationMap: OperationMap;
};

export type OperationSessionState = {
  query: Record<string, string>;
  mutation: Record<string, string>;
};
