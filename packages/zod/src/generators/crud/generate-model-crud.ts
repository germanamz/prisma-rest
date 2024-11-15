import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import {
  ImportQueue,
  namespaceGenerator,
  normalizeFilename,
  Registry,
} from '@germanamz/prisma-rest-toolbox';
import path from 'path';
import { generateInput } from './generate-input';
import { generateListFilter } from './generate-list-filter';
import { generateUniqueFilter } from './generate-unique-filter';

type GenerateModelCrudOptions = {
  dmmf: DMMF.Document;
  project: Project;
  dir: string;
  registry: Registry;
  importQueue: ImportQueue;
  item: DMMF.Model;
};

export const generateModelCrud = (options: GenerateModelCrudOptions) => {
  const dir = path.join(options.dir, normalizeFilename(options.item.name));

  return namespaceGenerator({
    ...options,
    dir,
    generator: () => [
      generateInput({
        ...options,
        dir,
        model: options.item,
        isOptional: false,
        suffix: 'CreateInput',
      }),
      generateInput({
        ...options,
        dir,
        model: options.item,
        isOptional: true,
        suffix: 'UpdateInput',
      }),
      generateListFilter({
        ...options,
        dir,
        model: options.item,
      }),
      generateUniqueFilter({
        ...options,
        dir,
        model: options.item,
      }),
    ],
  });
};
