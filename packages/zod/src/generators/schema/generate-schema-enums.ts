import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateSchemaEnum } from './generate-schema-enum';
import { generateNamespace, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateSchemaEnumsOptions = {
  project: Project;
  dir: string;
  enumTypes: DMMF.Document['schema']['enumTypes'];
  importQueue: ImportQueue;
  registry: Registry;
};

export const generateSchemaEnums = ({ dir, enumTypes, project, registry, importQueue }: GenerateSchemaEnumsOptions) => {
  return generateNamespace({
    dir,
    project,
    items: enumTypes.prisma,
    importQueue,
    registry,
    handler: generateSchemaEnum,
  });
};
