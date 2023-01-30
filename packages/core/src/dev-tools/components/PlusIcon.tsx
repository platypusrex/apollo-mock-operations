import React from 'react';
import { Icon } from '../styles';

interface PlusIconProps {
  open: boolean;
}

export const PlusIcon: React.FC<PlusIconProps> = ({ open }) => (
  <Icon
    open={open}
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
  </Icon>
);
