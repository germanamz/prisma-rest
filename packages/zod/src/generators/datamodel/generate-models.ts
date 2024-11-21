import { GeneratorContext, namespaceHandler } from '@germanamz/prisma-rest-toolbox';
import { MarshalModel } from '@germanamz/prisma-rest-marshal';
import { generateModel } from './generate-model';

type GenerateModelsOptions = GeneratorContext & {
  items: MarshalModel[];
};

export const generateModels = (options: GenerateModelsOptions) => namespaceHandler({
  ...options,
  handler: (item) => generateModel({
    ...options,
    item,
  }),
});
