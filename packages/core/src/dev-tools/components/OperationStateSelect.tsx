import React, { ChangeEvent } from 'react';

interface OperationStateSelectProps {
  operationName: string;
  operationState: string[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const OperationStateSelect: React.FC<OperationStateSelectProps> = React.memo(
  ({ operationName, operationState, value, onChange }) => (
    <div className="mock-devtools__content-body-operation">
      <div className="mock-devtools__form-control">
        <label>{operationName}</label>
        <select name={operationName} id="operation-state" value={value} onChange={onChange}>
          {operationState.map((state, i) => (
            <option key={`${state}-${i}`} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
);
