import { ApolloMockedDevtools } from '../dev-tools/types';
import { GetServerSideProps } from './types';
import { reactiveOperationState } from './reactiveOperationState';
import { APOLLO_MOCK_MODEL_STORE_KEY, APOLLO_MOCK_OPERATION_STATE_KEY } from '../constants';
import { MockGQLOperations } from '../MockGQLOperations';

type GetServerSideApolloMockedProps = (mockInstance: MockGQLOperations<any>) =>
  GetServerSideProps<Omit<ApolloMockedDevtools, 'operationMap'>>;
export const getServerSideApolloMockedProps: GetServerSideApolloMockedProps = (
  mockInstance: MockGQLOperations<any>
) =>
  async ({ req }) => {
    const operationState = req.cookies[APOLLO_MOCK_OPERATION_STATE_KEY];
    const modelState = req.cookies[APOLLO_MOCK_MODEL_STORE_KEY];
    reactiveOperationState(operationState);
    mockInstance.models._unsafeForceUpdateModelData(modelState);
    return { props: {} };
  };
