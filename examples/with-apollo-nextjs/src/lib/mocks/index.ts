import { mockInstance } from './builder';
import './operations';
import './models';

export const { models } = mockInstance;

export const MockProvider = mockInstance.createProvider();
export const Devtools = mockInstance.createDevtools();
export const mockLink = mockInstance.createMockLink();
