import { GeneratorContext, namespaceHandler } from '@germanamz/prisma-rest-toolbox';
import { generateService } from './generate-service';

export type GenerateServicesOptions = GeneratorContext & {
  clientPath: string;
};

export const generateCrudServices = (options: GenerateServicesOptions) => namespaceHandler({
  ...options,
  items: options.marshalDocument.models,
  handler: (item) => generateService({
    ...options,
    item,
  }),
});
