import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { executeImportQueue, generateNamespace, Registry } from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateApi } from './generate-api';

export type GenerateApisOptions = {
  project: Project;
  dir: string;
  models: readonly DMMF.Model[];
  registry: Registry;
  dmmf: DMMF.Document;
};

export const generateApis = ({
  project, dir, models, registry, dmmf,
}: GenerateApisOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>();
  const file = generateNamespace({
    dir,
    project,
    registry,
    importQueue,
    dmmf,
    generator: (opts) => {
      const apisFile = generateNamespace({
        ...opts,
        dir: path.join(dir, 'apis'),
        items: models,
        handler: generateApi,
      });

      return [
        apisFile,
      ];
    },
  });

  executeImportQueue(importQueue, registry);

  return file;
};
