import type { MockedDevtoolsProps } from '../dev-tools/types';
import type { MockGQLOperations } from '../MockGQLOperations';
import type { GetServerSideProps } from './types';
import { reactiveOperationState } from './reactiveOperationState';
import { APOLLO_MOCK_MODEL_STORE_KEY, APOLLO_MOCK_OPERATION_STATE_KEY } from '../constants';

type GetServerSideApolloMockedProps = (mockInstance: MockGQLOperations<any, any>) =>
  GetServerSideProps<Omit<MockedDevtoolsProps, 'operationMap' | 'defaultOperationState'>>;
export const getServerSideApolloMockedProps: GetServerSideApolloMockedProps = (
  mockInstance: MockGQLOperations<any, any>
) =>
  async ({ req }) => {
    const operationState = req.cookies[APOLLO_MOCK_OPERATION_STATE_KEY];
    const modelState = req.cookies[APOLLO_MOCK_MODEL_STORE_KEY];
    reactiveOperationState(operationState);
    // @ts-ignore
    mockInstance._modelsInstance._unsafeForceUpdateModelData(modelState);
    return { props: {} };
  };
