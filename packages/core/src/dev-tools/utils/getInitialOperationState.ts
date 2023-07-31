import { parseJSON } from '../../utils/parseJSON';
import { getCookie } from '../hooks';
import type { OperationMap, OperationSessionState } from '../types';
import { APOLLO_MOCK_OPERATION_STATE_KEY } from '../../constants';

const getOperationState = (operations: OperationMap['query'] | OperationMap['mutation']) =>
  operations.reduce<{ [key: string]: string }>((acc, curr) => {
    const [[key, value]] = Object.entries(curr);
    const state = value.defaultState ?? value.options[0];
    acc[key] = value.options.find((v) => v === state) as string
    return acc;
  }, {});

export const getInitialOperationState = (operationMap: OperationMap) => {
  const operationState = getCookie(APOLLO_MOCK_OPERATION_STATE_KEY);
  if (!operationState) {
    const { query, mutation } = operationMap;
    return {
      query: getOperationState(query),
      mutation: getOperationState(mutation)
    };
  }

  const currentState = parseJSON<OperationSessionState>(operationState);
  return {
    query: currentState?.query ?? {},
    mutation: currentState?.mutation ?? {},
  };
};
