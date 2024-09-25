import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import {
  generateNamespace,
  ImportQueue,
  normalizeFilename,
  Registry,
} from '@germanamz/prisma-rest-toolbox';
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

export const generateModelCrud = (options: GenerateModelCrudOptions) => generateNamespace({
  ...options,
  dir: `${options.dir}/${normalizeFilename(options.item.name)}`,
  generator: (opts) => [
    generateInput({
      ...opts,
      model: options.item,
      isOptional: false,
      suffix: 'CreateInput',
    }),
    generateInput({
      ...opts,
      model: options.item,
      isOptional: true,
      suffix: 'UpdateInput',
    }),
    generateListFilter({
      ...opts,
      model: options.item,
    }),
    generateUniqueFilter({
      ...opts,
      model: options.item,
    }),
  ],
});
