import React from 'react';

interface OperationSectionProps {
  title: string;
  children: React.ReactNode;
}

export const OperationSection: React.FC<OperationSectionProps> = ({ title, children }) => (
  <div className="mock-devtools__content-body-query">
    <h2>{title}</h2>
    {children}
  </div>
);
