import { DMMF } from '@prisma/generator-helper';
import { SourceFile } from 'ts-morph';
import {
  executeImportQueue, GeneratorContext, namespaceGenerator, namespaceHandler,
} from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateApi } from './generate-api';

export type GenerateApisOptions = GeneratorContext & {
  models: readonly DMMF.Model[];
};

export const generateApis = (options: GenerateApisOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>();
  const file = namespaceGenerator({
    ...options,
    generator: () => {
      const apisDir = path.join(options.dir, 'apis');
      const apisFile = namespaceHandler({
        ...options,
        dir: apisDir,
        items: options.models,
        handler: (item) => generateApi({
          ...options,
          dir: apisDir,
          importQueue,
          item,
        }),
      });

      return [
        apisFile,
      ];
    },
  });

  executeImportQueue(importQueue, options.registry);

  return file;
};
