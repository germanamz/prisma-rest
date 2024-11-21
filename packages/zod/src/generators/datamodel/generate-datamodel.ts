import path from 'path';
import {
  GeneratorContext, namespaceGenerator,
} from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnums } from './generate-datamodel-enums';
import { generateModels } from './generate-models';

export type GenerateDatamodelOptions = GeneratorContext;

// TODO: Use MarshalDocument
export const generateDatamodel = (options: GenerateDatamodelOptions) => namespaceGenerator({
  ...options,
  generator: () => [
    generateDatamodelEnums({
      ...options,
      dir: path.join(options.dir, 'enums'),
    }),
    generateModels({
      ...options,
      models: options.dmmf.datamodel.types,
      dir: path.join(options.dir, 'types'),
    }),
    generateModels({
      ...options,
      models: options.dmmf.datamodel.models,
      dir: path.join(options.dir, 'models'),
    }),
  ],
});
