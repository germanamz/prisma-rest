import { GeneratorContext, namespaceHandler } from '@germanamz/prisma-rest-toolbox';
import { generateService } from './generate-service';

export type GenerateServicesOptions = GeneratorContext & {
  clientPath: string;
};

// TODO: Use MarshalDocument
export const generateCrudServices = (options: GenerateServicesOptions) => namespaceHandler({
  ...options,
  items: options.dmmf.datamodel.models,
  handler: (item) => generateService({
    ...options,
    item,
  }),
});
