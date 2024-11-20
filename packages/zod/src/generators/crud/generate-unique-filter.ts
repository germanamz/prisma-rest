import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import {
  addToImportQueue,
  createSourceFile,
  declareConstant,
  ImportQueue,
  Registry,
} from '@germanamz/prisma-rest-toolbox';
import { declareSelect } from './lib/declare-select';
import { genFieldZodType } from '../../helpers/gen-field-zod-type';

export type GenerateUniqueFilterOptions = {
  dmmf: DMMF.Document;
  project: Project;
  dir: string;
  registry: Registry;
  importQueue: ImportQueue;
  model: DMMF.Model;
};

// TODO: Use MarshalDocument
export const generateUniqueFilter = (options: GenerateUniqueFilterOptions) => {
  const {
    project,
    dir,
    model,
    importQueue,
    registry,
  } = options;
  const name = `${model.name}UniqueFilter`;
  const whereIdentifier = `${name}Where`;
  const selectIdentifier = `${name}Select`;
  const sourceFile = createSourceFile({
    project,
    dir,
    name,
  });
  const idField = model.fields.find((field) => field.isId);
  const singleUniqueFields = model.fields.filter((field) => field.isUnique);
  const numberOfFields = model.uniqueFields.length + singleUniqueFields.length + (idField ? 1 : 0);

  sourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  addToImportQueue(importQueue, sourceFile, ['OrderDirection']);

  declareSelect({
    name: selectIdentifier,
    sourceFile,
    registry,
    fields: model.fields,
    importQueue,
  });
  declareConstant({
    name: whereIdentifier,
    isExported: true,
    sourceFile,
    registry,
    initializer: (writer) => {
      writer.write('z.preprocess(parseJsonPreprocessor, ');
      if (numberOfFields > 1) {
        writer.writeLine('z.union([');
      }

      if (idField) {
        writer.writeLine(`z.object({ ${idField.name}: ${genFieldZodType({
          field: idField,
          importQueue,
          sourceFile,
        })} })${numberOfFields > 1 ? ',' : ''}`);
      }

      singleUniqueFields.forEach((uniqueField) => {
        writer.writeLine(`z.object({ ${uniqueField.name}: ${genFieldZodType({
          field: uniqueField,
          importQueue,
          sourceFile,
        })} })${numberOfFields > 1 ? ',' : ''}`);
      });

      model.uniqueFields.forEach((uniqueFields) => {
        const joinedFieldName = uniqueFields.join('_');

        writer.indent(() => {
          writer.writeLine(`z.object({ ${joinedFieldName}: z.object({`);

          uniqueFields.forEach((uniqueFieldName) => {
            const uniqueField = model.fields.find((field) => field.name === uniqueFieldName)!;

            if (uniqueField.kind === 'enum') {
              writer.writeLine(`${uniqueFieldName}: ${uniqueField.type},`);

              addToImportQueue(importQueue, sourceFile, [uniqueField.type]);

              return;
            }

            writer.writeLine(`${uniqueField.name}: ${genFieldZodType({
              field: uniqueField,
              importQueue,
              sourceFile,
            })},`);
          });

          writer.writeLine('}),');
        });

        writer.write(`})${numberOfFields > 1 ? ',' : ''}`);
      });

      if (numberOfFields > 1) {
        writer.write('])');
      }
      writer.write(')');
    },
  });
  declareConstant({
    name,
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.object({');

      writer.writeLine(`where: ${whereIdentifier},`);
      writer.writeLine(`select: ${selectIdentifier}.optional(),`);

      writer.write('})');
    },
  });

  return sourceFile;
};
