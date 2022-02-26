export class OperationModel<TModel extends Record<string, any>> {
  private _models: TModel[]
  constructor(models: TModel[]) {
    this._models = models;
  }

  get models() {
    return this._models;
  }

  getOne = (key: keyof Omit<TModel, '__typename'>, value: TModel[keyof TModel]) => {
    return this._models.find(model => model[key] === value) ?? null;
  }

  create = (model: TModel) => {
    this._models = [...this._models, model];
    return model;
  }

  add = (model: TModel) => {
    this._models.push(model);
  }

  delete = (key: keyof Omit<TModel, '__typename'>, value: TModel[keyof TModel]) => {
    console.log({ key, value })
    const model = this._models.find(model => model[key] === value);
    console.log({ model });
    if (!model) {
      throw new Error('Delete model: model not found. Please provide a unique key/value pair.')
    }
    this._models = this._models.filter(model => model[key] !== value);
    console.log({ models: this._models });
    return model;
  }
}
