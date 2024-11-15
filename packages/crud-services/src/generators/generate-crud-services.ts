import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import { namespaceHandler, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateService } from './generate-service';

export type GenerateServicesOptions = {
  models: DMMF.Datamodel['models'];
  dir: string;
  project: Project;
  clientPath: string;
  registry: Registry;
  dmmf: DMMF.Document;
};

export const generateCrudServices = (options: GenerateServicesOptions) => namespaceHandler({
  ...options,
  items: options.models,
  handler: (item) => generateService({
    ...options,
    item,
  }),
});
