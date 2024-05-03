import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { Registry } from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateCrudServices } from '@germanamz/prisma-generator-crud-services/dist';
import { generateZod } from '@germanamz/prisma-generator-zod';
import { generateApis } from './generate-apis';

export type GenerateHonoOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
  clientPath?: string;
};

export const generateHono = ({ project, dmmf, dir, registry, clientPath }: GenerateHonoOptions) => {
  return [
    generateCrudServices({
      project,
      dir: path.join(dir, 'services'),
      models: dmmf.datamodel.models,
      registry,
      clientPath,
    }),
    generateZod({
      project,
      dir: path.join(dir, 'zod'),
      dmmf,
      registry,
    }),
    generateApis({
      project,
      dir: path.join(dir, 'hono'),
      models: dmmf.datamodel.models,
      registry,
    }),
  ];
};
