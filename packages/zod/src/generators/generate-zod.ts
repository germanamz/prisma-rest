import path from 'path';
import {
  executeImportQueue, GeneratorContext, namespaceGenerator,
} from '@germanamz/prisma-rest-toolbox';
import { generateDatamodel } from './datamodel/generate-datamodel';
import { generateCrud } from './crud/generate-crud';

export type GenerateZodOptions = GeneratorContext;

export const generateZod = (options: GenerateZodOptions) => {
  const indexFile = namespaceGenerator({
    ...options,
    generator: () => [
      generateDatamodel({
        ...options,
        dir: path.join(options.dir, 'datamodel'),
      }),
      generateCrud({
        ...options,
        dir: path.join(options.dir, 'crud'),
      }),
    ],
  })!;

  executeImportQueue(options.importQueue, options.registry);

  return indexFile;
};
