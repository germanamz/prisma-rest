import {
  GeneratorContext, namespaceGenerator,
} from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateZod } from '@germanamz/prisma-generator-zod';
import { generateCrudServices } from '@germanamz/prisma-generator-crud-services';
import { generateApis } from './generate-apis';

export type GenerateHonoOptions = GeneratorContext & {
  clientPath: string;
};

export const generateHono = (options: GenerateHonoOptions) => namespaceGenerator({
  ...options,
  generator: () => [
    generateCrudServices({
      ...options,
      dir: path.join(options.dir, 'services'),
    }),
    generateZod({
      ...options,
      dir: path.join(options.dir, 'zod'),
    }),
    generateApis({
      ...options,
      dir: path.join(options.dir, 'apis'),
    }),
  ],
});
