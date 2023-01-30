import React, { MutableRefObject } from 'react';
import { PlusIcon } from './PlusIcon';
import styles from './ToggleButton.module.css';

interface ToggleButtonProps {
  ref: MutableRefObject<HTMLButtonElement | null>;
  open: boolean;
  onClick: () => void;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ open, onClick }, ref) => (
    <button
      ref={ref}
      // @ts-ignore
      className={styles[open ? 'toggleButton' : 'toggleButtonClose']}
      aria-label={!open ? 'close' : 'open'}
      onClick={onClick}
    >
      <PlusIcon open={open} />
    </button>
  )
);
