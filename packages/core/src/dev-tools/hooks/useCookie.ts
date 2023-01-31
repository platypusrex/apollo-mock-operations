import { useState } from 'react';
import { isSSR } from '../../utils/isSSR';

interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  SameSite?: 'None' | 'Lax' | 'Strict';
  Secure?: boolean;
  HttpOnly?: boolean;
}

export function stringifyOptions(options: CookieOptions) {
  return Object.keys(options).reduce((acc, key) => {
    const optionsKey = key as keyof CookieOptions;
    if (key === 'days') {
      return acc;
    } else {
      if (options[optionsKey] === false) {
        return acc;
      } else if (options[optionsKey] === true) {
        return `${acc}; ${key}`;
      } else {
        return `${acc}; ${key}=${options[optionsKey]}`;
      }
    }
  }, '');
}

export const setCookie = (name: string, value: any, options?: CookieOptions) => {
  if (isSSR()) return;

  const optionsWithDefaults = {
    days: 7,
    path: '/',
    ...options,
  };

  const expires = new Date(Date.now() + optionsWithDefaults.days * 864e5).toUTCString();

  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    '; expires=' +
    expires +
    stringifyOptions(optionsWithDefaults);
};

export const getCookie = (name: string, initialValue = '') => {
  return (
    (!isSSR() &&
      document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
      }, '')) ||
    initialValue
  );
};

export const destroyCookie = (name: string) => {
  const options = { path: '/', };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1)
  const expires = yesterday.toUTCString();
  console.log({ expires, cookie: `${name}=;expires=${expires}${stringifyOptions(options)}` });

  document.cookie = `${name}=;expires=${expires}${stringifyOptions(options)}`;
}

type UseCookie = [string, (value: string, options?: CookieOptions) => void];

export const useCookie = (key: string, initialValue = ''): UseCookie => {
  const [item, setItem] = useState(() => {
    return getCookie(key, initialValue);
  });

  const updateItem = (value: string, options?: CookieOptions) => {
    setItem(value);
    setCookie(key, value, options);
  };

  return [item, updateItem];
};
