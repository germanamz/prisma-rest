import { DMMF } from '@prisma/generator-helper';
import { addToImportQueue, ImportQueue } from '@germanamz/prisma-rest-toolbox';
import { SourceFile } from 'ts-morph';
import { genZodScalar } from './gen-zod-scalar';

export type GenFieldZodTypeOptions = {
  field: DMMF.Field;
  sourceFile: SourceFile;
  importQueue: ImportQueue;
  isOptional?: boolean;
};

export const genFieldZodType = (options: GenFieldZodTypeOptions) => {
  const {
    field,
    sourceFile,
    importQueue,
    isOptional,
  } = options;
  let zod = '';

  if (field.kind === 'scalar') {
    zod = genZodScalar(field.type, field.isList, field.isRequired);
  } else {
    zod = field.type;
    addToImportQueue(importQueue, sourceFile, [field.type]);

    if (!field.isRequired) {
      return `${zod}.nullish()`;
    }
  }

  if (isOptional) {
    zod = `${zod}.optional()`;
  }

  return zod;
};
