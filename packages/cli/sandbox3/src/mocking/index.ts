import { mockInstance } from './builder';
/**
 * Import all operations and models here:
 * import './operations';
 * import './models';
 */

export const MockProvider = mockInstance.createProvider();
export const Devtools = mockInstance.createDevtools();
export const mockLink = mockInstance.createMockLink();
export const { models } = mockInstance;
