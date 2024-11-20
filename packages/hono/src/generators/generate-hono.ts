import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import { makeGeneratorContext, namespaceGenerator, Registry } from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateCrudServices } from '@germanamz/prisma-generator-crud-services/dist';
import { generateZod } from '@germanamz/prisma-generator-zod';
import { generateApis } from './generate-apis';

export type GenerateHonoOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
  clientPath: string;
};

export const generateHono = (options: GenerateHonoOptions) => namespaceGenerator({
  ...options,
  generator: () => [
    generateCrudServices({
      ...options,
      dir: path.join(options.dir, 'services'),
      models: options.dmmf.datamodel.models,
    }),
    generateZod(makeGeneratorContext({
      ...options,
      dir: path.join(options.dir, 'zod'),
    })),
    generateApis({
      ...options,
      dir: path.join(options.dir, 'apis'),
      models: options.dmmf.datamodel.models,
    }),
  ],
});
