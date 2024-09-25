import { DMMF } from '@prisma/generator-helper';
import {
  addToImportQueue, declareConstant, ImportQueue, Registry,
} from '@germanamz/prisma-rest-toolbox';
import { SourceFile } from 'ts-morph';

export type DeclareSelectOptions = {
  name: string;
  sourceFile: SourceFile;
  fields: readonly DMMF.Field[];
  registry: Registry;
  importQueue: ImportQueue;
};

export const declareSelect = (options: DeclareSelectOptions) => {
  const {
    name,
    sourceFile,
    fields,
    registry,
    importQueue,
  } = options;

  addToImportQueue(importQueue, sourceFile, ['parseJsonPreprocessor']);

  declareConstant({
    name,
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.writeLine('z.preprocess(parseJsonPreprocessor, z.object({');

      writer.indent(() => {
        fields.forEach((field) => {
          if (!['scalar', 'enum'].includes(field.kind)) {
            // Ignore non-scalar fields
            return;
          }

          writer.writeLine(`${field.name}: z.boolean().optional(),`);
        });
      });

      writer.write('}))');
    },
  });
};
