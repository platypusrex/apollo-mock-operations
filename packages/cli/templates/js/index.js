import { mockBuilder } from './builder';
/**
 * Import all operations and models here:
 * import './operations';
 * import './models';
 */

export const MockProvider = mockBuilder.createProvider();
export const Devtools = mockBuilder.createDevtools();
export const mockLink = mockBuilder.createMockLink();
export const { models } = mockBuilder;
