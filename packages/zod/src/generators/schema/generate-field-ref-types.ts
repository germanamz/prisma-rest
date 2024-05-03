import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateFieldRefType } from './generate-field-ref-type';
import { generateNamespace, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateFieldRefTypesOptions = {
  project: Project;
  dir: string;
  fieldRefTypes: DMMF.Document['schema']['fieldRefTypes'];
  registry: Registry;
  importQueue: ImportQueue;
};

export const generateFieldRefTypes = ({ project, dir, fieldRefTypes, importQueue, registry }: GenerateFieldRefTypesOptions) => {
  return generateNamespace({
    project,
    dir,
    registry,
    importQueue,
    items: fieldRefTypes.prisma,
    handler: generateFieldRefType,
  });
};
