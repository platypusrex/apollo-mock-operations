export interface OperationMeta {
  query: string;
  operationName: string;
  operationCount?: number;
  variables: Record<string, any>;
  result: Record<string, any>;
}
