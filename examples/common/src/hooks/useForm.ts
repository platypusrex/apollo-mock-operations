import { ChangeEvent, useState } from 'react';
import { AnyObject } from '@apollo-mock-operations/core';

export interface UseForm<TValues = AnyObject> {
  values: TValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useForm = <TFormValues extends Record<string, any>>(
  initialValues: TFormValues
): UseForm<TFormValues> => {
  const [values, setValues] = useState(initialValues);
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const reset = (): void => {
    setValues(initialValues);
  };
  return { values, onChange, reset };
};
