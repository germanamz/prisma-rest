import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateNamespace, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnum } from './generate-datamodel-enum';

export type GenerateDatamodelEnumsOptions = {
  dir: string;
  project: Project;
  registry: Registry;
  importQueue: ImportQueue;
  dmmf: DMMF.Document;
};

export const generateDatamodelEnums = ({
  dir, project, registry, importQueue, dmmf,
}: GenerateDatamodelEnumsOptions) => generateNamespace({
  dir,
  project,
  registry,
  importQueue,
  dmmf,
  items: dmmf.datamodel.enums,
  handler: generateDatamodelEnum,
});
