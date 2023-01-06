import { parseJSON } from '../../utils/parseJSON';
import { OperationMap, OperationSessionState } from '../types';
import { APOLLO_MOCK_OPERATION_STATE_KEY } from '../../constants';
import { getCookie } from '../hooks';

const getOperationState = (operations: OperationMap['query'] | OperationMap['mutation']) =>
  operations.reduce<{ [key: string]: string }>((acc, curr) => {
    const [[key, value]] = Object.entries(curr);
    acc[key] = value[0];
    return acc;
  }, {});

export const getInitialOperationState = (operationMap: OperationMap) => {
  const operationState = getCookie(APOLLO_MOCK_OPERATION_STATE_KEY);

  if (operationState) {
    const currentState = parseJSON<OperationSessionState>(operationState);

    const queryKeys = Object.keys(currentState?.query ?? {});
    const mutationKeys = Object.keys(currentState?.mutation ?? {});
    const { query, mutation } = operationMap;

    return {
      query: !queryKeys.length ? getOperationState(query) : currentState?.query ?? {},
      mutation: !mutationKeys.length ? getOperationState(mutation) : currentState?.mutation ?? {},
    };
  } else {
    return { query: {}, mutation: {} };
  }
};
