import { parseJSON } from '../../utils/parseJSON';
import { getCookie } from '../hooks';
import { OperationMap, OperationSessionState } from '../types';
import { APOLLO_MOCK_OPERATION_STATE_KEY } from '../../constants';

const getOperationState = (
  operations: OperationMap['query'] | OperationMap['mutation'],
  defaultState: string
) =>
  operations.reduce<{ [key: string]: string }>((acc, curr) => {
    const [[key, value]] = Object.entries(curr);
    acc[key] = value.find((v) => v === defaultState) || value[0];
    return acc;
  }, {});

export const getInitialOperationState = (
  operationMap: OperationMap,
  defaultOperationState: string
) => {
  const operationState = getCookie(APOLLO_MOCK_OPERATION_STATE_KEY);
  if (!operationState) {
    const { query, mutation } = operationMap;
    return {
      query: getOperationState(query, defaultOperationState),
      mutation: getOperationState(mutation, defaultOperationState)
    };
  }

  const currentState = parseJSON<OperationSessionState>(operationState);
  return {
    query: currentState?.query ?? {},
    mutation: currentState?.mutation ?? {},
  };
};
