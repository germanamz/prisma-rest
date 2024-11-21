import path from 'path';
import {
  GeneratorContext, namespaceGenerator,
} from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnums } from './generate-datamodel-enums';
import { generateModels } from './generate-models';

export type GenerateDatamodelOptions = GeneratorContext;

export const generateDatamodel = (options: GenerateDatamodelOptions) => namespaceGenerator({
  ...options,
  generator: () => [
    generateDatamodelEnums({
      ...options,
      dir: path.join(options.dir, 'enums'),
    }),
    // TODO: Add support for mongo schemas, for now we only support postgres
    /* generateModels({
      ...options,
      items: options.marshalDocument.types,
      dir: path.join(options.dir, 'types'),
    }), */
    generateModels({
      ...options,
      items: options.marshalDocument.models,
      dir: path.join(options.dir, 'models'),
    }),
  ],
});
