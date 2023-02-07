import { OperationModel } from './OperationModel';
import { isSSR } from './utils/isSSR';
import { parseJSON } from './utils/parseJSON';
import { getCookie, setCookie } from './dev-tools/hooks';
import { NonEmptyArray, OperationType, ResolverReturnType } from './types';
import { APOLLO_MOCK_MODEL_STORE_KEY } from './constants';

export class OperationModels<TModels extends Record<string, OperationModel<any>>> {
  private static instance: OperationModels<any>;
  // @ts-ignore
  public models: TModels = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance<T extends Record<string, OperationModel<any>>>(): OperationModels<T> {
    if (!OperationModels.instance) {
      OperationModels.instance = new OperationModels();
    }
    return OperationModels.instance;
  }

  private getInitialModelData = <K extends keyof OperationType<any, any>>(
    name: K,
    models: NonEmptyArray<ResolverReturnType<OperationType<any, any>[K]>>
  ) => {
    if (isSSR()) return models;

    const persistedModelState = getCookie(APOLLO_MOCK_MODEL_STORE_KEY);
    if (persistedModelState) {
      const parsedModelState =
        parseJSON<Record<K, NonEmptyArray<ResolverReturnType<OperationType<any, any>[K]>>>>(
          persistedModelState
        );
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

  createModel = <K extends keyof OperationType<any, any>>(
    name: K,
    data: NonEmptyArray<ResolverReturnType<OperationType<any, any>[K]>>
  ) => {
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
        this.models[key]._unsafeForceUpdateModelData((parsedModelData as any)[key]);
      });
    }
  };
}
