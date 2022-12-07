import { mockBuilder } from './builder';
import './operations';
import './models';

const { models, createProvider } = mockBuilder;

export const MockProvider = createProvider();
export { models };
