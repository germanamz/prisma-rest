import { DMMF } from '@prisma/generator-helper';
import { addToImportQueue, ImportQueue } from '@germanamz/prisma-rest-toolbox';
import { SourceFile } from 'ts-morph';
import { prismaToZodScalar } from './prisma-to-zod-scalar';

export const genZodScalar = (type: string, isList: boolean, isRequired: boolean) => {
  let zod = `z.${prismaToZodScalar(type)}()`;

  if (isList) {
    zod = `z.array(${zod})`;
  }

  if (!isRequired) {
    zod = `${zod}.nullish()`;
  }

  return zod;
};

export type GenPrismaZodOptions = {
  field: DMMF.Field;
  sourceFile: SourceFile;
  importQueue: ImportQueue;
  isOptional?: boolean;
};

export const genFieldZodType = (options: GenPrismaZodOptions) => {
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
  }

  if (isOptional) {
    zod = `${zod}.optional()`;
  }

  return zod;
};
