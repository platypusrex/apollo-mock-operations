import { mockBuilder } from './builder';
import './operations';
import './models';

const { models, createDevtools, createProvider, createMockLink } = mockBuilder;

export const MockProvider = createProvider();
export const Devtools = createDevtools();

export const mockLink = createMockLink();

export { models };
