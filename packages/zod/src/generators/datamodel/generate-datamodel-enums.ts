import {
  GeneratorContext, namespaceHandler,
} from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnum } from './generate-datamodel-enum';

export type GenerateDatamodelEnumsOptions = GeneratorContext;

export const generateDatamodelEnums = (options: GenerateDatamodelEnumsOptions) => namespaceHandler({
  ...options,
  items: options.marshalDocument.enums,
  handler: (item) => generateDatamodelEnum({
    ...options,
    item,
  }),
});
