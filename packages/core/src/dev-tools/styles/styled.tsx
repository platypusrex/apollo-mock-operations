import React, { createElement, type PropsWithChildren, useInsertionEffect } from 'react';
import { compile, serialize, stringify } from 'stylis';

type TemplateArgs<TProps> = (props: TProps) => string | boolean;

type ComponentPropType = { [key: string]: any };

type StyledAttributeProps<TTag extends keyof JSX.IntrinsicElements> =  TTag extends 'button'
  ? React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  : TTag extends 'input'
    ? React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
    : TTag extends 'select'
      ? React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
      : TTag extends 'svg'
        ? React.SVGProps<SVGSVGElement>
        : TTag extends keyof HTMLElementTagNameMap
          ? React.HTMLAttributes<HTMLElementTagNameMap[TTag]>
          : never;

type CompProps<
  TProps extends PropsWithChildren,
  TTag extends keyof JSX.IntrinsicElements
> = TProps & { ref?: any } & StyledAttributeProps<TTag>

const styleCache = new Map()

function css(styles: string, className: string) {
  const rule = `.${className} { ${styles} }`;
  const cssStr = serialize(compile(rule), stringify);
  const style = document.createElement('style');
  style.setAttribute('data-apollo-mocked-operations', 'css');
  style.innerText = cssStr;
  return style;
}

function resolveRule<TProps extends PropsWithChildren>(
  rules: readonly string[],
  args: TemplateArgs<TProps>[],
  props: CompProps<TProps, any>
) {
  return rules.reduce((output, part, i) => {
    let cssString = output + part;
    if (args[i]) {
      const arg = args[i](props)
      if (typeof arg === 'string') cssString = cssString + args[i](props)
    }
    return cssString;
  }, ``).replace(/[\t\n]/g, '').replace(/\s+/g, ' ').trim();
}

function generateId() {
  return Math.random()
    .toString(36)
    .substring(2, 6);
}

function filterComponentProps<
  TProps extends ComponentPropType,
  TTag extends keyof JSX.IntrinsicElements
>(props: CompProps<TProps, TTag>) {
  return Object.keys(props)
    .filter((key) => !key.includes('$'))
    .reduce((acc, curr) => {
      acc = Object.assign(acc, { [curr]: props[curr] });
      return acc;
    }, {})
}

function useCSS<TProps extends PropsWithChildren>(
  rules: TemplateStringsArray,
  args: TemplateArgs<TProps>[],
  props: CompProps<TProps, any>
) {
  const rule = resolveRule(rules.raw, args, props);
  const className = `css-${generateId()}`;

  useInsertionEffect(() => {
    if (!styleCache.has(rule)) {
      styleCache.set(rule, className)
      const style = css(rule, className);
      document.head.appendChild(style);
    }
  }, [rule]);

  return styleCache.get(rule) ?? className;
}

export function styled<TTag extends keyof JSX.IntrinsicElements>(tag: TTag) {
  return function styledTemplate<TProps extends ComponentPropType>(
    rules: TemplateStringsArray,
    ...args: TemplateArgs<TProps>[]
  ) {
    return React.forwardRef((props: CompProps<TProps, TTag>, ref) => {
      const className = useCSS(rules, args, props);

      return createElement(tag, {
        className,
        ref,
        ...filterComponentProps<TProps, TTag>(props)
      });
    })
  };
}
