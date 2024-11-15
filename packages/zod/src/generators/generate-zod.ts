import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';

import path from 'path';
import { executeImportQueue, namespaceGenerator, Registry } from '@germanamz/prisma-rest-toolbox';
import { MarshalDocument } from '@germanamz/prisma-rest-marshal';
import { generateDatamodel } from './datamodel/generate-datamodel';
import { generateCrud } from './crud/generate-crud';

export type GenerateZodOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
  marshalDocument: MarshalDocument;
};

export const generateZod = (options: GenerateZodOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>();
  const indexFile = namespaceGenerator({
    ...options,
    generator: () => [
      generateDatamodel({
        ...options,
        importQueue,
        dir: path.join(options.dir, 'datamodel'),
      }),
      generateCrud({
        ...options,
        importQueue,
        dir: path.join(options.dir, 'crud'),
      }),
    ],
  })!;

  executeImportQueue(importQueue, options.registry);

  return indexFile;
};
