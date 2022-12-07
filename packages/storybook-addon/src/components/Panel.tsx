import React, { ChangeEvent, useState } from 'react';
import type { RenderOptions } from '@storybook/addons';
import { useGlobals } from '@storybook/api';
import { styled } from '@storybook/theming';
import { AddonPanel, Form, H2, SyntaxHighlighter } from '@storybook/components';
import type { OperationMeta } from '../types/shared';
import { ADDON_ID } from '../constants';

const PanelContainer = styled.div`
  padding: 20px;
`;

const ContentContainer = styled.div`
  padding: 20px 15px;
`;

const PanelCard = styled.div`
  margin-bottom: 20px;
`;

const PanelTitle = styled(H2)`
  font-weight: bold;
  font-size: 16px;
  border-bottom: 0;
`;

export const Panel = ({ active = false, key }: RenderOptions): React.ReactElement => {
  const [globals] = useGlobals();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const operationMeta: OperationMeta[] = globals[`${ADDON_ID}/operations`];
  const activeMeta = operationMeta?.[activeCardIndex];

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentIdx = Number(e.currentTarget.value);
    setActiveCardIndex(currentIdx);
  };

  return (
    <AddonPanel key={key} active={active}>
      {operationMeta && operationMeta?.length > 0 && (
        <PanelContainer>
          {/* @ts-ignore */}
          <Form.Field label="Operations">
            <Form.Select size="auto" value={activeCardIndex} onChange={handleSelectChange}>
              {operationMeta.map(({ operationName, operationCount }, i) => (
                <option key={operationName + i} value={i}>
                  {i + 1}. {operationName} {operationCount ? `(${operationCount})` : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Field>
          {activeMeta ? (
            <ContentContainer>
              <PanelCard>
                <PanelTitle>Query</PanelTitle>
                {/* @ts-ignore */}
                <SyntaxHighlighter language="graphql" copyable bordered padded>
                  {activeMeta.query}
                </SyntaxHighlighter>
              </PanelCard>
              {Object.keys(activeMeta.variables)?.length > 0 && (
                <PanelCard>
                  <PanelTitle>Variables</PanelTitle>
                  {/* @ts-ignore */}
                  <SyntaxHighlighter language="json" copyable bordered padded>
                    {JSON.stringify(activeMeta.variables, null, 2)}
                  </SyntaxHighlighter>
                </PanelCard>
              )}
              <PanelCard>
                <PanelTitle>Result</PanelTitle>
                {/* @ts-ignore */}
                <SyntaxHighlighter language="json" copyable bordered padded>
                  {JSON.stringify(activeMeta.result, null, 2)}
                </SyntaxHighlighter>
              </PanelCard>
            </ContentContainer>
          ) : null}
        </PanelContainer>
      )}
    </AddonPanel>
  );
};
