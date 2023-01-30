import React, { ChangeEvent } from 'react';
import styles from './OperationStateSelect.module.css';

interface OperationStateSelectProps {
  operationName: string;
  operationState: string[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const OperationStateSelect: React.FC<OperationStateSelectProps> = React.memo(
  ({ operationName, operationState, value, onChange }) => (
    <div className={styles.content}>
      <div className={styles.formControl}>
        <div className={styles.selectContainer}>
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
        </div>
      </div>
    </div>
  )
);
