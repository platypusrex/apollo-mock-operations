import deepmerge from 'deepmerge';
import { parseJSON } from './utils/parseJSON';
import { getCookie, setCookie } from './dev-tools/hooks';
import { APOLLO_MOCK_MODEL_STORE_KEY } from './constants';
import type { DeepPartial, MockModelsType, NonEmptyArray, WhereQuery } from './types';

export class OperationModel<TModel extends MockModelsType> {
  private _models = new Map<number, TModel>();
  private readonly _name: keyof TModel;

  constructor(name: keyof TModel, models: NonEmptyArray<TModel>) {
    this._name = name;
    models?.forEach((model, i) => {
      this._models.set(i, model);
    });
  }

  // @ts-ignore prevent exposing this to consumers
  private _unsafeForceUpdateModelData = (modelData: NonEmptyArray<TModel>) => {
    // TODO: compare and update existing model map rather than replacing with entirely new map
    const newMap = new Map();
    modelData.forEach((model, i) => {
      newMap.set(i, model);
    });
    this._models = newMap;
  };

  private updateOperationModelCookie = (models: Map<number, TModel>) => {
    const modelStateCookie = getCookie(APOLLO_MOCK_MODEL_STORE_KEY);
    if (modelStateCookie) {
      const parsedModelState = (parseJSON(modelStateCookie) as any) ?? {};
      setCookie(
        APOLLO_MOCK_MODEL_STORE_KEY,
        JSON.stringify({
          ...parsedModelState,
          [this._name]: Array.from(models.values()),
        })
      );
    }
  };

  private getModelDataFromQuery = ({
    where,
  }: WhereQuery<TModel>): {
    models: { key: number; data: TModel }[];
    size: number;
  } | null => {
    const modelProps = Object.entries(where ?? {});
    if (!modelProps?.length) {
      throw new Error('At least one query property must be provided');
    }

    const filteredModels = Array.from(this._models.entries())
      .filter(([, m]) => {
        return modelProps.every(([key, value]) => m[key] === value);
      })
      .map(([key, data]) => ({ key, data }));
    if (!filteredModels?.length) return null;

    return {
      models: filteredModels,
      size: filteredModels.length,
    };
  };

  get models(): TModel[] {
    return Array.from(this._models.values());
  }

  findFirst = (): TModel | null => {
    const [firstModel] = this._models.values();
    if (!firstModel) return null;
    return firstModel;
  };

  findLast = (): TModel | null => {
    const model = Array.from(this._models.values()).at(this._models.size - 1);
    if (!model) return null;
    return model;
  };

  findOne = ({ where }: WhereQuery<TModel>): TModel | null => {
    const result = this.getModelDataFromQuery({ where });
    return result?.models.length ? result.models[0].data : null;
  };

  findMany = ({ where }: WhereQuery<TModel>): TModel[] | null => {
    const result = this.getModelDataFromQuery({ where });
    return result?.models.map((model) => model.data) ?? null;
  };

  create = ({ data }: { data: TModel }): TModel => {
    this._models.set(this._models.size, data);
    this.updateOperationModelCookie(this._models);

    return data;
  };

  update = ({ where }: WhereQuery<TModel>, { data }: { data: DeepPartial<TModel> }): TModel => {
    const result = this.getModelDataFromQuery({ where });
    if (result && result?.size > 2) {
      // eslint-disable-next-line no-console
      console.warn(
        'update model: more than one model found. Please provide a unique key/value pair for improved results.'
      );
    }

    if (!result) {
      throw new Error('Model not found. Please provide a unique key/value pair.');
    }

    const model = result.models[0];
    // @ts-ignore TODO: resolve issue with deep partial of TModel passed to deepmerge fn
    const updatedModel = deepmerge<TModel>(model.data, data);
    this._models.set(model.key, { ...this._models.get(model.key), ...updatedModel });
    this.updateOperationModelCookie(this._models);

    return updatedModel;
  };

  delete = ({ where }: WhereQuery<TModel>): TModel => {
    const result = this.getModelDataFromQuery({ where });
    if (!result) {
      throw new Error('Delete model: model not found. Please provide a unique key/value pair.');
    }

    const model = result.models[0];
    this._models.delete(model.key);
    this.updateOperationModelCookie(this._models);

    return model.data;
  };
}
