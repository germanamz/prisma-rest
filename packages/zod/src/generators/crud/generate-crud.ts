import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import { generateNamespace, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';
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

export const generateCrud = (options: GenerateCrudOptions) => generateNamespace({
  ...options,
  generator: (opts) => [
    generateGlobalCrudBasics({ ...opts }),
    generateNamespace({
      ...opts,
      dir: `${opts.dir}/enums`,
      items: opts.dmmf.datamodel.enums,
      handler: generateEnumOperators,
    }),
    generateNamespace({
      ...opts,
      dir: `${opts.dir}/models`,
      items: opts.dmmf.datamodel.models,
      handler: generateModelCrud,
    }),
  ],
});
