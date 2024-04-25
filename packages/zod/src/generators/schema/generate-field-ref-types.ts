import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateNamespace } from '../helpers/generate-namespace';
import { generateFieldRefType } from './generate-field-ref-type';

export type GenerateFieldRefTypesOptions = {
  project: Project;
  dir: string;
  fieldRefTypes: DMMF.Document['schema']['fieldRefTypes'];
  registry: Map<string, SourceFile>;
  importQueue: Map<SourceFile, Set<string>>;
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
