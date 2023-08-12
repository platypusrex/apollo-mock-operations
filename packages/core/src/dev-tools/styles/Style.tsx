import React, { createElement, forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';

type StyleProps = {
  [key: string]: any;
  children: string;
};

const useStyle = (children: string) => {
  const styleRef = useRef(children);

  if (styleRef.current !== children) {
    styleRef.current = children;
  }

  return styleRef.current;
};

export const styled = (rules: TemplateStringsArray, ...args: any[]) => {
  return rules.reduce((output, part, i) => {
    let cssString = output + part;
    if (args[i]) {
      const arg = args[i]
      if (typeof arg === 'string') cssString = cssString + args[i]
    }
    return cssString;
  }, ``).replace(/[\t\n]/g, '').replace(/\s+/g, ' ').trim();
}

export const Style = forwardRef<HTMLLinkElement | HTMLStyleElement, StyleProps>(
  function Style(props, ref) {
    const style = useStyle(props.children);
    const styleComponent = createElement(
      'style',
      Object.assign({}, { 'data-apollo-mocked-operations': 'css' }, { ref }),
      styled`${style}`
    );

    return (
      <>{createPortal(styleComponent, document.head)}</>
    );
  }
);
