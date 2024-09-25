import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { generateNamespace } from '@germanamz/prisma-rest-toolbox';
import { generateModel } from './generate-model';

type GenerateModelsOptions = {
  dir: string;
  project: Project;
  models: DMMF.Document['datamodel']['models'] | DMMF.Document['datamodel']['types'];
  registry: Map<string, SourceFile>;
  importQueue: Map<SourceFile, Set<string>>;
  dmmf: DMMF.Document;
};

export const generateModels = ({
  project,
  dir,
  models,
  registry,
  importQueue,
  dmmf,
}: GenerateModelsOptions) => generateNamespace({
  project,
  dir,
  items: models,
  importQueue,
  registry,
  dmmf,
  handler: generateModel,
});
