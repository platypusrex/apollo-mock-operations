import { mockBuilder } from './builder';
import './operations';
import './models';

export const { models } = mockBuilder;

export const MockProvider = mockBuilder.createProvider();
export const Devtools = mockBuilder.createDevtools();
export const mockLink = mockBuilder.createMockLink();
