import type { MockedDevtoolsProps } from '../dev-tools/types';
import type { GetServerSideProps } from './types';
import { reactiveOperationState } from './reactiveOperationState';
import { APOLLO_MOCK_MODEL_STORE_KEY, APOLLO_MOCK_OPERATION_STATE_KEY } from '../constants';

export const getServerSideApolloMockedProps = <TMockGQLOperations>(
  mockInstance: TMockGQLOperations
): GetServerSideProps<Omit<MockedDevtoolsProps, 'operationMap'>> =>
  async ({ req }) => {
    const operationState = req.cookies[APOLLO_MOCK_OPERATION_STATE_KEY];
    const modelState = req.cookies[APOLLO_MOCK_MODEL_STORE_KEY];
    reactiveOperationState(operationState);
    // @ts-ignore
    mockInstance._modelsInstance._unsafeForceUpdateModelData(modelState);
    return { props: {} };
  };
