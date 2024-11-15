import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import path from 'path';
import { generateNamespace, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnums } from './generate-datamodel-enums';
import { generateModels } from './generate-models';

export type GenerateDatamodelOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
  importQueue: ImportQueue;
};

export const generateDatamodel = (options: GenerateDatamodelOptions) => generateNamespace({
  ...options,
  generator: (opts) => [
    generateDatamodelEnums({
      ...opts,
      dir: path.join(opts.dir, 'enums'),
    }),
    generateModels({
      ...opts,
      models: opts.dmmf.datamodel.types,
      dir: path.join(opts.dir, 'types'),
    }),
    generateModels({
      ...opts,
      models: opts.dmmf.datamodel.models,
      dir: path.join(opts.dir, 'models'),
    }),
  ],
});
