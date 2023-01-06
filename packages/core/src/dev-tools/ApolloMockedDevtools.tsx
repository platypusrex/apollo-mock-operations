import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { parseJSON } from '../utils/parseJSON';
import { useCookie } from './hooks';
import { getInitialOperationState } from './utils';
import { OperationStateSelect, PlusIcon, OperationSection } from './components';
import { ApolloMockedDevtools, OperationMap, OperationSessionState } from './types';
import { APOLLO_MOCK_OPERATION_STATE_KEY } from '../constants';

export const MockedDevTools: React.FC<ApolloMockedDevtools> = ({ operationMap }) => {
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
    const initialState = getInitialOperationState(operationMap);
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
      <button
        ref={buttonRef}
        className={`mock-devtools__button ${drawerVisible ? 'close' : ''}`}
        aria-label={drawerVisible ? 'close' : 'open'}
        onClick={toggleDrawer}
      >
        <PlusIcon className={drawerVisible ? 'close' : ''} />
      </button>
      <section
        ref={containerRef}
        className={`mock-devtools__content ${drawerVisible ? 'visible' : ''}`}
      >
        <div className="mock-devtools__content-header">
          <h1>Operations</h1>
        </div>
        <div className="mock-devtools__content-body">
          {operationMap.query.length > 0 && (
            <OperationSection title="Query">
              {operationMap.query.map((query, i) => {
                const [operation] = Object.entries(query);
                return (
                  <OperationStateSelect
                    key={`${operation[0]}-${i}`}
                    operationName={operation[0]}
                    operationState={operation[1]}
                    value={parsedOperations?.query[operation[0]]}
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
                    value={parsedOperations?.mutation[operation[0]]}
                    onChange={(e) => handleSetOperationState(e, 'mutation')}
                  />
                );
              })}
            </OperationSection>
          )}
        </div>
        <div className="mock-devtools__content-footer" />
      </section>
    </footer>
  );
};
