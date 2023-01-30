import React from 'react';
import styles from './OperationSection.module.css';

interface OperationSectionProps {
  title: string;
  children: React.ReactNode;
}

export const OperationSection: React.FC<OperationSectionProps> = ({ title, children }) => (
  // @ts-ignore
  <div className={styles.contentBody}>
    <h2>{title}</h2>
    {children}
  </div>
);
