import React, { useState } from 'react';
import { Form, SyntaxHighlighter, H4 } from '@storybook/components';

export const ApolloClientPanel: React.FC<{ operationMeta: Record<string, any>[]}> = ({ operationMeta }) => {
  const [metaIndex, setMetaIndex] = useState(0)
  const activeMeta = operationMeta[metaIndex];

  return (
    <div style={{ padding: 20 }}>
      <Form.Field label="Operations">
        <Form.Select
          value={metaIndex}
          size="auto"
          onChange={(e) => setMetaIndex(Number(e.currentTarget.value))}
        >
          {operationMeta.map(({ operationName, operationCount }, i) => (
            <option key={operationName + i} value={i}>
              {i + 1}. {operationName} {operationCount ? `(${operationCount})` : ''}
            </option>
          ))}
        </Form.Select>
      </Form.Field>
      {activeMeta ? (
        <div style={{ padding: '20px 15px' }}>
          <div style={{ marginBottom: 20 }}>
            <H4>Query</H4>
            <SyntaxHighlighter language="graphql" copyable bordered padded>
              {activeMeta.query}
            </SyntaxHighlighter>
          </div>
          {Object.keys(activeMeta.variables).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <H4>Variables</H4>
              <SyntaxHighlighter language="javascript" copyable bordered padded>
                {JSON.stringify(activeMeta.variables, null, 2)}
              </SyntaxHighlighter>
            </div>
          )}
          <div>
            <H4>Result</H4>
            <SyntaxHighlighter language="javascript" copyable bordered padded>
              {JSON.stringify(activeMeta.result, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : null}
    </div>
  );
};
