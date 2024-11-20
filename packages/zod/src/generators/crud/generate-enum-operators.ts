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

  return sourceFile;
};
