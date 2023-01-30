import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { parseJSON } from '../utils/parseJSON';
import { useCookie } from './hooks';
import { getInitialOperationState } from './utils';
import { OperationStateSelect, OperationSection, ToggleButton } from './components';
import { Container, ContainerBody, ContainerFooter, ContainerHeader } from './styles';
import { MockedDevtoolsProps, OperationMap, OperationSessionState } from './types';
import { APOLLO_MOCK_OPERATION_STATE_KEY } from '../constants';

export const MockedDevTools: React.FC<MockedDevtoolsProps> = ({ operationMap, defaultOperationState }) => {
  const apolloClient = useApolloClient();

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [operationStateCookie, setCookie] = useCookie(
    APOLLO_MOCK_OPERATION_STATE_KEY,
    JSON.stringify({
      query: {},
      mutation: {},
    })
  );

  const parsedOperations = useMemo<OperationSessionState>(() => {
    return parseJSON(operationStateCookie) ?? { query: {}, mutation: {} };
  }, [operationStateCookie]);

  useEffect(() => {
    const initialState = getInitialOperationState(operationMap, defaultOperationState);
    setCookie(JSON.stringify(initialState));
  }, []);

  useEffect(() => {
    if (drawerVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }
  }, [drawerVisible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const container = containerRef.current;
      const button = buttonRef.current;
      if (
        drawerVisible &&
        container &&
        target &&
        !container.contains(target) &&
        !button?.contains(target)
      ) {
        setDrawerVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [drawerVisible, setDrawerVisible]);

  const toggleDrawer = () => {
    setDrawerVisible((prevState) => !prevState);
  };

  const handleSetOperationState = async (
    e: ChangeEvent<HTMLSelectElement>,
    type: keyof OperationMap
  ) => {
    const key = e.target.name;
    const value = e.target.value;

    const newOpState = {
      ...parsedOperations,
      [type]: { ...parsedOperations[type], [key]: value },
    };
    setCookie(JSON.stringify(newOpState));
    if (type === 'query') {
      apolloClient.refetchQueries({ include: 'active' });
      await apolloClient.clearStore();
    }
  };

  return (
    <footer>
      <ToggleButton ref={buttonRef} open={!drawerVisible} onClick={toggleDrawer} />
      <Container visible={drawerVisible} ref={containerRef}>
        <ContainerHeader>
          <h1>Operations</h1>
        </ContainerHeader>
        <ContainerBody>
          {operationMap.query.length > 0 && (
            <OperationSection title="Query">
              {operationMap.query.map((query, i) => {
                const [operation] = Object.entries(query);
                return (
                  <OperationStateSelect
                    key={`${operation[0]}-${i}`}
                    operationName={operation[0]}
                    operationState={operation[1]}
                    value={parsedOperations?.query[operation[0]] ?? defaultOperationState}
                    onChange={(e) => handleSetOperationState(e, 'query')}
                  />
                );
              })}
            </OperationSection>
          )}
          {operationMap.mutation.length > 0 && (
            <OperationSection title="Mutation">
              {operationMap.mutation.map((mutation, i) => {
                const [operation] = Object.entries(mutation);
                return (
                  <OperationStateSelect
                    key={`${operation[0]}-${i}`}
                    operationName={operation[0]}
                    operationState={operation[1]}
                    value={parsedOperations?.mutation[operation[0]] ?? defaultOperationState}
                    onChange={(e) => handleSetOperationState(e, 'mutation')}
                  />
                );
              })}
            </OperationSection>
          )}
        </ContainerBody>
        <ContainerFooter />
      </Container>
    </footer>
  );
};
