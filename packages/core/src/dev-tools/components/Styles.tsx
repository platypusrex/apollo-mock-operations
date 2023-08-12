import React from 'react';
import { Style, styled } from '../styles/Style';

const BASE_CLASS = 'apollo-mocked-dev-tools';
export const ELEMENTS = {
  container: `${BASE_CLASS}__container`,
  containerHeader: `${BASE_CLASS}__container-header`,
  containerBody: `${BASE_CLASS}__container-body`,
  containerFooter: `${BASE_CLASS}__container-footer`,
  toggleBtn: `${BASE_CLASS}__toggle-btn`,
  plusIcon: `${BASE_CLASS}__plus-icon`,
  operationSectionContainer: `${BASE_CLASS}__operation-section-container`,
  operationSelectContainer: `${BASE_CLASS}__operation-select-container`,
  operationFormControl: `${BASE_CLASS}__operation-form-control`,
  selectContainer: `${BASE_CLASS}__select-container`,
} as const;

const container = styled`
  .${ELEMENTS.container} {
    transition: height 0.2s ease-in-out, transform 0.3s ease-in-out;
    transform: translateY(350px);
    background: #fff;
    border: 1px solid #d8d8d8;
    overflow-y: scroll;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 0;
    display: grid;
  }
  
  .${ELEMENTS.container}.visible {
    box-shadow: 0 0 18px -9px rgba(0,0,0,0.5);
    height: 350px;
    transform: translateY(0);
  }
`;

const containerHeader = styled`
  .${ELEMENTS.containerHeader} {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d8d8d8;
    padding: 0.5rem 1rem;
  }
  
  .${ELEMENTS.containerHeader} h1 {
    margin: 0;
    font-size: 0.875rem;
  }
`;

const containerBody = styled`
  .${ELEMENTS.containerBody} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 1rem;
  }
`;

const toggleBtn = styled`
  .${ELEMENTS.toggleBtn} {
    cursor: pointer;
    border-radius: 50%;
    height: 45px;
    width: 45px;
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    border: none;
    box-shadow: 0 1px 10px -1px rgba(0,0,0,0.25);
    background: #BA0F30;
    transition: background 0.2s ease-in-out;
    z-index: 1;
    
    &:hover {
      background: #AE002B;
      transition: background 0.2s ease-in-out;
    }
  }
  
  .${ELEMENTS.toggleBtn}.open {
    background: #3f20ba;
    
    &:hover {
      background: #311c87;
    }
  }
`;

const plusIcon = styled`
  .${ELEMENTS.plusIcon} {
    display: inline-block;
    vertical-align: -0.125em;
    fill: currentcolor;
    width: 1em;
    height: 1em;
    font-size: 1.875rem;
    color: #fff;
    transition: transform 0.2s ease-in-out;
    transform: rotate(45deg);
  }
  
  .${ELEMENTS.plusIcon}.open {
    transform: rotate(0deg);
  }
`;

const operationSectionContainer = styled`
  .${ELEMENTS.operationSectionContainer} h2 {
    margin: 0 0 0.875rem;
    font-size: 0.875rem; 
  }
`;

const operationSelectContainer = styled`
  .${ELEMENTS.operationSelectContainer} {
    margin-block-end: 0.5rem;
    display: grid;
    align-items: center;
    gap: 1rem;
    grid-auto-flow: column;
    width: fit-content;
  }
  
  .${ELEMENTS.operationSelectContainer} p {
    margin: 0 0 0.125rem;
    font-size: 14px;
    font-weight: 600;
  }
`;

const operationFormControl = styled`
  .${ELEMENTS.operationFormControl} {
    display: flex;
    align-items: center;
    margin-block-end: 0.875rem;
  }
  
  .${ELEMENTS.operationFormControl} select {
    appearance: none;
    width: fit-content;
    border: 1px solid #c3c3c3;
    padding: 0.375rem 2rem 0.375rem 0.375rem;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .${ELEMENTS.operationFormControl} input {
    margin: 0 0.5rem 0 0;
    padding: 0
  }
  
  .${ELEMENTS.operationFormControl} label {
    font-size: 14px;
    margin: 0 0.5rem 0.175rem 0;
  }
`;

const selectContainer = styled`
  .${ELEMENTS.selectContainer} {
    position: relative;
  }
  
  .${ELEMENTS.selectContainer}::after {
    content: "\\203A";
    font-size: 25px;
    color: #3a3a3a;
    transform: rotate(90deg);
    right: 8px;
    top: -1px;
    position: absolute;
    pointer-events: none;
  }
`;

const containerFooter = styled`
  .${ELEMENTS.containerFooter} {
    padding: 26px;
  }
`;

export const Styles: React.FC = () => (
  <Style>{`
    ${container}
    ${containerHeader}
    ${containerBody}
    ${operationSectionContainer}
    ${operationSelectContainer}
    ${operationFormControl}
    ${selectContainer}
    ${toggleBtn}
    ${plusIcon}
    ${containerFooter}
  `}</Style>
)
