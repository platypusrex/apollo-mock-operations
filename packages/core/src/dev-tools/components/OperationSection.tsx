import React from 'react';
import { OperationSectionContainer } from '../styles';

type OperationSectionProps = {
  title: string;
  children: React.ReactNode;
};

export const OperationSection: React.FC<OperationSectionProps> = ({ title, children }) => (
  <OperationSectionContainer>
    <h2>{title}</h2>
    {children}
  </OperationSectionContainer>
);
