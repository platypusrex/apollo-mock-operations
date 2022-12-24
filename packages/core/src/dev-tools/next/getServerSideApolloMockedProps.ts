import { ApolloMockedDevtools } from '../types';
import { GetServerSideProps } from './types';
import { reactiveOperationState } from './reactiveOperationState';

export const getServerSideApolloMockedProps: GetServerSideProps<
  Omit<ApolloMockedDevtools, 'operationMap'>
> = async ({ req }) => {
  const operationState = req.cookies['apollo_mock_operation_state'];
  reactiveOperationState(operationState);
  return { props: {} };
};
