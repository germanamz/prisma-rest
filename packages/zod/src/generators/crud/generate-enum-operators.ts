import { DMMF } from '@prisma/generator-helper';
import {
  addToImportQueue,
  createSourceFile,
  declareConstant,
  GeneratorContext,
} from '@germanamz/prisma-rest-toolbox';

export type GenerateEnumOperatorsOptions = GeneratorContext & {
  item: DMMF.DatamodelEnum;
};

export const generateEnumOperators = (options: GenerateEnumOperatorsOptions) => {
  const {
    project,
    dir,
    registry,
    item,
    importQueue,
  } = options;
  const sourceFile = createSourceFile({
    project,
    dir,
    name: `${item.name}Operators`,
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  addToImportQueue(importQueue, sourceFile, [
    item.name,
  ]);

  declareConstant({
    name: `${item.name}EqualityFilterOperators`,
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.object({');

      writer.writeLine(`equals: ${item.name}.optional(),`);
      writer.writeLine(`not: ${item.name}.optional(),`);
      writer.writeLine(`in: z.array(${item.name}).optional(),`);
      writer.writeLine(`notIn: z.array(${item.name}).optional(),`);

      writer.write('})');
    },
  });

  declareConstant({
    name: `${item.name}NullableListEqualityFilterOperators`,
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.object({');

      writer.writeLine(`equals: z.array(${item.name}).nullable(),`);
      writer.writeLine(`has: ${item.name}.nullable(),`);
      writer.writeLine(`hasEvery: z.array(${item.name}).optional(),`);
      writer.writeLine(`hasSome: z.array(${item.name}).optional(),`);
      writer.writeLine('isEmpty: z.boolean().optional(),');

      writer.write('})');
    },
  });

  return sourceFile;
};
