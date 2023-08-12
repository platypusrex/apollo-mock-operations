import React from 'react';
import { useMediaQuery } from '../hooks';

type StyledComponent<T> = T extends 'button'
  ? React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  : T extends 'input'
    ? React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
    : T extends 'select'
      ? React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
      : T extends keyof HTMLElementTagNameMap
        ? React.HTMLAttributes<HTMLElementTagNameMap[T]>
        : never;

type Styles =
  | React.CSSProperties
  | ((props: Record<string, any>) => React.CSSProperties)

export function styledInline<T extends keyof HTMLElementTagNameMap>(
  type: T,
  newStyles: Styles,
  queries: Record<string, Styles> = {},
) {
  return React.forwardRef<HTMLElementTagNameMap[T], StyledComponent<T>>(
    ({ style, ...rest }, ref) => {

      const mediaStyles = Object.entries(queries).reduce(
        (current, [key, value]) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          return useMediaQuery(key)
            ? {
              ...current,
              ...(typeof value === 'function' ? value(rest) : value),
            }
            : current
        },
        {},
      )

      return React.createElement(type, {
        ...rest,
        style: {
          ...(typeof newStyles === 'function'
            ? newStyles(rest)
            : newStyles),
          ...style,
          ...mediaStyles,
        },
        ref,
      })
    },
  )
}
