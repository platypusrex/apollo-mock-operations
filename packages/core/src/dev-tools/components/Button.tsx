import React, { useRef } from 'react';
import { styled } from '../styles/styled';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

type StyledButton = {
  $color: string;
  $height: number;
  $large: boolean;
  $foo: string;
}

const StyledButton = styled('button')<StyledButton>`
  cursor: pointer;
  color: #fff;
  background: #3f20ba;
  border: none;
  border-radius: 0.25rem;
  height: ${({ $height }) => `${$height}px`};
  margin-left: auto;
  padding-inline: 0.675rem;
  transition: background 0.2s ease-in-out;
  
  &:hover {
    background: ${({ $color }) => $color};
    transition: background 0.2s ease-in-out;
  }
  
  ${({ $large }) => $large && `
    height: 36px;
  `}
`;

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  const buttonRef = useRef(null);
  return (
    <StyledButton
      ref={buttonRef}
      $color="cornflowerblue"
      $height={28}
      $large={false}
      $foo="bar"
      id="apollo-mocked-devtools__reset-button"
      onClick={onClick}
    >
      {children}
    </StyledButton>
  )
}
