import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { generateNamespace, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateService } from './generate-service';

export type GenerateServicesOptions = {
  models: DMMF.Datamodel['models'];
  dir: string;
  project: Project;
  clientPath: string;
  registry: Registry;
  dmmf: DMMF.Document;
};

export const generateCrudServices = ({
  models, dir, project, clientPath, registry, dmmf,
}: GenerateServicesOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>();

  return generateNamespace({
    project,
    dir,
    items: models,
    registry,
    importQueue,
    dmmf,
    handler: (opts) => generateService({ ...opts, clientPath }),
  });
};
