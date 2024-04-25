import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateNamespace } from '../helpers/generate-namespace';
import { generateEnum } from './generate-enum';

export type GenerateEnumsOptions = {
  project: Project;
  dir: string;
  enumTypes: DMMF.Document['schema']['enumTypes'];
  importQueue: Map<SourceFile, Set<string>>;
  registry: Map<string, SourceFile>;
};

export const generateEnums = ({ dir, enumTypes, project, registry, importQueue }: GenerateEnumsOptions) => {
  return generateNamespace({
    dir,
    project,
    items: enumTypes.prisma,
    importQueue,
    registry,
    handler: generateEnum,
  });
};
