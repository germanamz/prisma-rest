import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { generateService } from './generate-service';
import { generateNamespace, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateServicesOptions = {
  models: DMMF.Datamodel['models'];
  dir: string;
  project: Project;
  clientPath?: string;
  registry: Registry;
};

export const generateCrudServices = ({ models, dir, project, clientPath, registry }: GenerateServicesOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>()

  return generateNamespace({
    project,
    dir,
    items: models,
    registry,
    importQueue,
    handler: (opts) => generateService({ ...opts, clientPath }),
  });
};
