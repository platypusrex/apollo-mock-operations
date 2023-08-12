import React, { type ChangeEvent } from 'react';
import { OperationSelectContainer, FormControl, SelectContainer } from '../styles';

type OperationStateSelectProps = {
  operationName: string;
  operationState: string[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export const OperationStateSelect: React.FC<OperationStateSelectProps> = React.memo(
  ({ operationName, operationState, value, onChange }) => (
    <OperationSelectContainer id="op-select-container">
      <FormControl id="form-control">
        <SelectContainer id="select-container">
          <label>{operationName}</label>
          <select
            name={operationName}
            id={`operation-state-${operationName}`}
            value={value}
            onChange={onChange}
          >
            {operationState.map((state, i) => (
              <option key={`${state}-${i}`} value={state}>
                {state}
              </option>
            ))}
          </select>
        </SelectContainer>
      </FormControl>
    </OperationSelectContainer>
  )
);
