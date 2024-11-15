import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { ImportQueue, namespaceHandler, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnum } from './generate-datamodel-enum';

export type GenerateDatamodelEnumsOptions = {
  dir: string;
  project: Project;
  registry: Registry;
  importQueue: ImportQueue;
  dmmf: DMMF.Document;
};

export const generateDatamodelEnums = (options: GenerateDatamodelEnumsOptions) => namespaceHandler({
  ...options,
  items: options.dmmf.datamodel.enums,
  handler: (item) => generateDatamodelEnum({
    ...options,
    item,
  }),
});
