import React, { type MutableRefObject } from 'react';
import { PlusIcon } from './PlusIcon';
import { Toggle } from '../styles';

type ToggleButtonProps = {
  ref: MutableRefObject<HTMLButtonElement | null>;
  open: boolean;
  onClick: () => void;
};

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ open, onClick }, ref) => (
    <Toggle
      $open={open}
      ref={ref}
      aria-label={!open ? 'close' : 'open'}
      onClick={onClick}
    >
      <PlusIcon open={open} />
    </Toggle>
  )
);
