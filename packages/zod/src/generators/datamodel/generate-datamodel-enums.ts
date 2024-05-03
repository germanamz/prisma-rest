import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateDatamodelEnum } from './generate-datamodel-enum';
import { generateNamespace, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateDatamodelEnumsOptions = {
  dir: string;
  project: Project;
  enums: DMMF.Document['datamodel']['enums'];
  registry: Registry;
  importQueue: ImportQueue;
};

export const generateDatamodelEnums = ({ dir, project, enums, registry, importQueue }: GenerateDatamodelEnumsOptions) => {
  return generateNamespace({
    dir,
    project,
    registry,
    importQueue,
    items: enums,
    handler: generateDatamodelEnum,
  });
};
