import styled from '@emotion/styled';

export const Container = styled.section<{ visible: boolean }>`
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
  
  ${({ visible }) => visible && `
    box-shadow: 0 0 18px -9px rgba(0,0,0,0.5);
    height: 350px;
    transform: translateY(0);
  `};
`;

export const ContainerHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d8d8d8;
  padding: 0.5rem 1rem;
  
  h1 {
    margin: 0;
    font-size: 0.875rem;
  }
`;

export const ContainerBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 1rem;
`;

export const ContainerFooter = styled.div`
  padding: 26px;
`;

export const StyledButton = styled.button`
  cursor: pointer;
  color: #fff;
  background: #3f20ba;
  border: none;
  border-radius: 0.25rem;
  height: 28px;
  margin-left: auto;
  padding-inline: 0.675rem;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #311c87;
    transition: background 0.2s ease-in-out;
  }
`;

export const Toggle = styled.button<{ open: boolean }>`
  cursor: pointer;
  border-radius: 50%;
  height: 45px;
  width: 45px;
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  border: none;
  box-shadow: 0 1px 10px -1px rgba(0,0,0,0.25);
  background: ${({ open }) => open ? '#3f20ba' : '#BA0F30'};
  transition: background 0.2s ease-in-out;
  z-index: 1;
  
  &:hover {
    background: ${({ open }) => open ? '#311c87' : '#AE002B'};
    transition: background 0.2s ease-in-out;
  }
`;

export const Icon = styled.svg<{ open: boolean }>`
  display: inline-block;
  vertical-align: -0.125em;
  fill: currentcolor;
  width: 1em;
  height: 1em;
  font-size: 1.875rem;
  color: #fff;
  transition: transform 0.2s ease-in-out;
  transform: ${({ open }) => `rotate(${open ? '0deg' : '45deg'})`};
`

export const OperationSectionContainer = styled.div`
  h2 {
    margin: 0 0 0.875rem;
    font-size: 0.875rem; 
  }
`;

export const OperationSelectContainer = styled.div`
  margin-block-end: 0.5rem;
  display: grid;
  align-items: center;
  gap: 1rem;
  grid-auto-flow: column;
  width: fit-content;

  p {
    margin: 0 0 0.125rem;
    font-size: 14px;
    font-weight: 600;
  }
`;

export const FormControl = styled.div`
  display: flex;
  align-items: center;
  margin-block-end: 0.875rem;

  select {
    appearance: none;
    width: fit-content;
    border: 1px solid #c3c3c3;
    padding: 0.375rem 2rem 0.375rem 0.375rem;
    border-radius: 4px;
    font-size: 12px;
  }

  input {
    margin: 0 0.5rem 0 0;
    padding: 0
  }

  label {
    font-size: 14px;
    margin: 0 0.5rem 0.175rem 0;
  }
`;

export const SelectContainer = styled.div`
  position: relative;
  
  &:after {
    content: "\203A";
    font-size: 25px;
    color: #3a3a3a;
    transform: rotate(90deg);
    right: 8px;
    top: -1px;
    position: absolute;
    pointer-events: none;
  }
`;
