import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import {
  ImportQueue, namespaceGenerator, namespaceHandler, Registry,
} from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateModelCrud } from './generate-model-crud';
import { generateGlobalCrudBasics } from './generate-global-crud-basics';
import { generateEnumOperators } from './generate-enum-operators';

type GenerateCrudOptions = {
  dmmf: DMMF.Document;
  project: Project;
  dir: string;
  registry: Registry;
  importQueue: ImportQueue;
};

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
