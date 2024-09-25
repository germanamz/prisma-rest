import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import {
  addToImportQueue,
  createSourceFile,
  declareConstant,
  ImportQueue,
  Registry,
} from '@germanamz/prisma-rest-toolbox';
import { prismaToZodScalar } from '../../helpers/prisma-to-zod-scalar';
import { declareSelect } from './lib/declare-select';

export type GenerateListFilterOptions = {
  dmmf: DMMF.Document;
  project: Project;
  dir: string;
  registry: Registry;
  importQueue: ImportQueue;
  model: DMMF.Model;
};

export const generateListFilter = (options: GenerateListFilterOptions) => {
  const {
    project,
    dir,
    model,
    importQueue,
    registry,
  } = options;
  const name = `${model.name}ListFilter`;
  const whereIdentifier = `${name}Where`;
  const whereFieldsIdentifier = `${name}WhereFields`;
  const selectIdentifier = `${name}Select`;
  const orderByIdentifier = `${name}OrderBy`;
  const sourceFile = createSourceFile({
    project,
    dir,
    name,
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  addToImportQueue(importQueue, sourceFile, ['OrderDirection', 'parseJsonPreprocessor']);

  declareSelect({
    name: selectIdentifier,
    sourceFile,
    registry,
    fields: model.fields,
    importQueue,
  });
  declareConstant({
    name: orderByIdentifier,
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.writeLine('z.preprocess(parseJsonPreprocessor, z.array(z.union([');

      writer.indent(() => {
        model.fields.forEach((field) => {
          if (!['scalar', 'enum'].includes(field.kind)) {
            // Ignore non-scalar fields
            return;
          }

          writer.writeLine(`z.object({ ${field.name}: OrderDirection }),`);
        });
      });

      writer.write('])))');
    },
  });
  declareConstant({
    name: whereFieldsIdentifier,
    isExported: true,
    sourceFile,
    registry,
    initializer: (writer) => {
      writer.writeLine('z.object({');

      model.fields.forEach((field) => {
        if (!['scalar', 'enum'].includes(field.kind)) {
          // Ignore non-scalar fields
          return;
        }

        const nullish = field.isRequired ? '.optional()' : '.nullish()';

        if (field.kind === 'enum') {
          const enumIdentifier = `${field.type}EqualityFilterOperators`;
          writer.writeLine(`${field.name}: ${enumIdentifier}${nullish},`);
          addToImportQueue(importQueue, sourceFile, [enumIdentifier]);

          return;
        }

        const zodType = prismaToZodScalar(field.type);
        const typeIdentifier = `${zodType[0].toUpperCase()}${zodType.substring(1)}FilterOperators`;

        writer.writeLine(`${field.name}: z.union([z.${zodType}(), ${typeIdentifier}])${nullish},`);
        addToImportQueue(importQueue, sourceFile, [typeIdentifier]);
      });

      writer.write('})');
    },
  });
  declareConstant({
    name: whereIdentifier,
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.preprocess(parseJsonPreprocessor, z.object({');

      writer.writeLine(`AND: z.array(${whereFieldsIdentifier}).optional(),`);
      writer.writeLine(`OR: z.array(${whereFieldsIdentifier}).optional(),`);
      writer.writeLine(`NOT: ${whereFieldsIdentifier}.optional(),`);

      writer.write(`}).merge(${whereFieldsIdentifier}))`);
    },
  });
  declareConstant({
    name,
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.object({');

      writer.writeLine('take: z.number().optional(),');
      writer.writeLine('skip: z.number().optional(),');
      writer.writeLine(`select: ${selectIdentifier}.optional(),`);
      writer.writeLine(`orderBy: ${orderByIdentifier}.optional(),`);
      writer.writeLine(`where: ${whereIdentifier},`);

      writer.write('})');
    },
  });

  return sourceFile;
};
