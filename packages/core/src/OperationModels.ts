import { OperationModel } from './OperationModel';
import { isSSR } from './utils/isSSR';
import { parseJSON } from './utils/parseJSON';
import { getCookie, setCookie } from './dev-tools/hooks';
import { APOLLO_MOCK_MODEL_STORE_KEY } from './constants';
import type { MockModelsType, NonEmptyArray, OperationModelsType, OperationType } from './types';

export class OperationModels<TModels extends MockModelsType> {
  private static instance: OperationModels<any>;
  // @ts-ignore
  public models: OperationModelsType<TModels> = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance<T extends MockModelsType>(): OperationModels<T> {
    if (!OperationModels.instance) {
      OperationModels.instance = new OperationModels();
    }
    return OperationModels.instance;
  }

  private getInitialModelData = <K extends keyof TModels>(
    name: K,
    models: NonEmptyArray<TModels[K]>
  ) => {
    if (isSSR()) return models;

    const persistedModelState = getCookie(APOLLO_MOCK_MODEL_STORE_KEY);
    if (persistedModelState) {
      const parsedModelState = parseJSON<Record<K, NonEmptyArray<TModels[K]>>>(persistedModelState);
      const modelData = parsedModelState?.[name] ?? models;
      setCookie(
        APOLLO_MOCK_MODEL_STORE_KEY,
        JSON.stringify({
          ...parsedModelState,
          [name]: modelData,
        })
      );
      return modelData;
    } else {
      setCookie(
        APOLLO_MOCK_MODEL_STORE_KEY,
        JSON.stringify({
          [name]: models,
        })
      );
      return models;
    }
  };

  createModel = <K extends keyof TModels>(name: K, data: NonEmptyArray<TModels[K]>) => {
    this.models = {
      ...this.models,
      [name]: new OperationModel<OperationType<any, any>>(
        name,
        this.getInitialModelData(name, data)
      ),
    };
    return this.models;
  };

  public _unsafeForceUpdateModelData = (models: string | undefined) => {
    const parsedModelData = parseJSON(models);
    const parsedModelKeys = Object.keys(parsedModelData ?? {});
    if (parsedModelKeys.length) {
      parsedModelKeys.forEach((key) => {
        // @ts-ignore accessing private class method
        this.models[key]._unsafeForceUpdateModelData((parsedModelData as any)[key]);
      });
    }
  };
}
