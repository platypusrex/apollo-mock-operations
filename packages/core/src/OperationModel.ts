import deepmerge from 'deepmerge';
import type {
  DeepPartial,
  NonEmptyArray,
  OperationType,
  ResolverReturnType,
  WhereQuery,
} from './types';

export class OperationModel<TModel extends OperationType<any, any>> {
  private _models = new Map<number, ResolverReturnType<TModel[keyof TModel]>>();

  constructor(models: NonEmptyArray<ResolverReturnType<TModel[keyof TModel]>>) {
    models.forEach((model, i) => {
      this._models.set(i, model);
    });
  }

  private getModelDataFromQuery = ({
    where,
  }: WhereQuery<TModel>): {
    models: { key: number; data: ResolverReturnType<TModel[keyof TModel]> }[];
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

  get models(): ResolverReturnType<TModel[keyof TModel]>[] {
    return Array.from(this._models.values());
  }

  findFirst = (): ResolverReturnType<TModel[keyof TModel]> | null => {
    const [firstModel] = this._models.values();
    if (!firstModel) return null;
    return firstModel;
  };

  findLast = (): ResolverReturnType<TModel[keyof TModel]> | null => {
    const model = Array.from(this._models.values()).at(this._models.size - 1);
    if (!model) return null;
    return model;
  };

  findOne = ({ where }: WhereQuery<TModel>): ResolverReturnType<TModel[keyof TModel]> | null => {
    const result = this.getModelDataFromQuery({ where });
    return result?.models.length ? result.models[0].data : null;
  };

  findMany = ({ where }: WhereQuery<TModel>): ResolverReturnType<TModel[keyof TModel]>[] | null => {
    const result = this.getModelDataFromQuery({ where });
    return result?.models.map((model) => model.data) ?? null;
  };

  create = ({
    data,
  }: {
    data: ResolverReturnType<TModel[keyof TModel]>;
  }): ResolverReturnType<TModel[keyof TModel]> => {
    this._models.set(this._models.size - 1, data);
    return data;
  };

  update = (
    { where }: WhereQuery<TModel>,
    { data }: { data: DeepPartial<ResolverReturnType<TModel[keyof TModel]>> }
  ): ResolverReturnType<TModel[keyof TModel]> => {
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

    const model = result.models[0].data;
    const updatedModel = deepmerge<ResolverReturnType<TModel[keyof TModel]>>(model.data, data);
    this._models.set(model.key, { ...this._models.get(model.key), ...updatedModel });
    return updatedModel;
  };

  delete = ({ where }: WhereQuery<TModel>): ResolverReturnType<TModel[keyof TModel]> => {
    const result = this.getModelDataFromQuery({ where });
    if (!result) {
      throw new Error('Delete model: model not found. Please provide a unique key/value pair.');
    }

    const model = result.models[0];
    this._models.delete(model.key);
    return model.data;
  };
}
