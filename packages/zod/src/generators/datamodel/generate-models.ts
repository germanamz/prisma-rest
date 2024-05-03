import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { generateModel } from './generate-model';
import { generateNamespace } from '@germanamz/prisma-rest-toolbox';

type GenerateModelsOptions = {
  dir: string;
  project: Project;
  models: DMMF.Document['datamodel']['models'] | DMMF.Document['datamodel']['types'];
  registry: Map<string, SourceFile>;
  importQueue: Map<SourceFile, Set<string>>;
};

export const generateModels = ({
  project,
  dir,
  models,
  registry,
  importQueue,
}: GenerateModelsOptions) => {
  return generateNamespace({
    project,
    dir,
    items: models,
    importQueue,
    registry,
    handler: generateModel,
  });
};
