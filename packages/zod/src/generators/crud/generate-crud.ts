import {
  GeneratorContext, namespaceGenerator, namespaceHandler,
} from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateModelCrud } from './generate-model-crud';
import { generateGlobalCrudBasics } from './generate-global-crud-basics';
import { generateEnumOperators } from './generate-enum-operators';

type GenerateCrudOptions = GeneratorContext;

export const generateCrud = (options: GenerateCrudOptions) => namespaceGenerator({
  ...options,
  generator: () => [
    generateGlobalCrudBasics({
      ...options,
    }),
    namespaceHandler({
      ...options,
      dir: path.join(options.dir, 'enums'),
      items: options.dmmf.datamodel.enums,
      handler: (item) => generateEnumOperators({
        ...options,
        item,
        dir: path.join(options.dir, 'enums'),
      }),
    }),
    namespaceHandler({
      ...options,
      dir: path.join(options.dir, 'models'),
      items: options.dmmf.datamodel.models,
      handler: (item) => generateModelCrud({
        ...options,
        item,
        dir: path.join(options.dir, 'models'),
      }),
    }),
  ],
});
