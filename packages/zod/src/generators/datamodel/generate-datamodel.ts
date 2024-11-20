import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import path from 'path';
import { ImportQueue, namespaceGenerator, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnums } from './generate-datamodel-enums';
import { generateModels } from './generate-models';

export type GenerateDatamodelOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
  importQueue: ImportQueue;
};

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
