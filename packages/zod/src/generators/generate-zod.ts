import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';

import path from 'path';
import { executeImportQueue, generateNamespace, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateDatamodel } from './datamodel/generate-datamodel';
import { generateCrud } from './crud/generate-crud';

export type GenerateZodOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
};

export const generateZod = (options: GenerateZodOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>();
  const indexFile = generateNamespace({
    ...options,
    importQueue,
    generator: (opts) => [
      generateDatamodel({
        ...opts,
        dir: path.join(opts.dir, 'datamodel'),
      }),
      generateCrud({
        ...opts,
        dir: path.join(opts.dir, 'crud'),
      }),
    ],
  })!;

  executeImportQueue(importQueue, options.registry);

  return indexFile;
};
