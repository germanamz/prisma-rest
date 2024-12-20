import { SourceFile } from 'ts-morph';
import {
  executeImportQueue, GeneratorContext, namespaceHandler,
} from '@germanamz/prisma-rest-toolbox';
import { generateApi } from './generate-api';

export type GenerateApisOptions = GeneratorContext;

export const generateApis = (options: GenerateApisOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>();
  const file = namespaceHandler({
    ...options,
    dir: options.dir,
    items: options.marshalDocument.models,
    handler: (item) => generateApi({
      ...options,
      dir: options.dir,
      importQueue,
      item,
    }),
  });

  executeImportQueue(importQueue, options.registry);

  return file;
};
