import { OperationState, OperationType } from '../types';

type OperationStateObject<TOperationState, TOperationReturn> = {
  state: TOperationState;
  value: TOperationReturn | (() => TOperationReturn);
}

type CreateOperationState<TMockOperation extends OperationType<any, any>, TOperationState> =
  | (
    (
      parent: Parameters<TMockOperation[keyof TMockOperation]>[0],
      args: Parameters<TMockOperation[keyof TMockOperation]>[1],
      context: Parameters<TMockOperation[keyof TMockOperation]>[2],
      info: Parameters<TMockOperation[keyof TMockOperation]>[3]
    ) =>
      OperationStateObject<TOperationState, ReturnType<TMockOperation[keyof TMockOperation]>>[])
  | OperationStateObject<TOperationState, ReturnType<TMockOperation[keyof TMockOperation]>>[];

export const createOperation = <
  TMockOperation extends OperationType<any, any>,
  TOperationState extends OperationState<TMockOperation, string>
>(
  name: keyof TMockOperation,
  state: CreateOperationState<TMockOperation, TOperationState[keyof TMockOperation]>
) => (action: Record<keyof TMockOperation, TOperationState[keyof TMockOperation]>) => ({
  [name]: (
    parent: Parameters<TMockOperation[keyof TMockOperation]>[0],
    variables: Parameters<TMockOperation[keyof TMockOperation]>[1],
    context: Parameters<TMockOperation[keyof TMockOperation]>[2],
    info: Parameters<TMockOperation[keyof TMockOperation]>[3]
  ) => {
    const currentState = action[name] ? action[name] : 'SUCCESS';
    let currentStateObj = typeof state === 'function'
      ? (state as Function)(parent, variables, context, info)
      : state;

    currentStateObj = [...currentStateObj].find(s => s.state === currentState);
    if (!currentStateObj) {
      throw new Error(`${name} operation: unable to match state`);
    }
    const { value } = currentStateObj;
    return typeof value === 'function' ? value() : value;
  }
});

