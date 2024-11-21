import { VariableDeclarationKind } from 'ts-morph';
import {
  addToImportQueue, createSourceFile, GeneratorContext,
} from '@germanamz/prisma-rest-toolbox';
import { MarshalModel } from '@germanamz/prisma-rest-marshal';

export type GenerateModelOptions = GeneratorContext & {
  item: MarshalModel;
};

export const generateModel = ({
  dir,
  item,
  project,
  importQueue,
  registry,
}: GenerateModelOptions) => {
  const { scalarFields, enumFields } = item;
  const file = createSourceFile({
    dir,
    project,
    name: item.name,
  });

  file.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  file.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: item.name,
        initializer: (writer) => {
          writer.writeLine('z.object({');

          writer.indent(() => {
            enumFields.forEach((field) => {
              addToImportQueue(importQueue, file, [field.type]);

              if (field.isList) { // List cannot be optional
                writer.writeLine(`${field.name}: ${field.type}.array(),`);

                return;
              }

              writer.writeLine(`${field.name}: ${field.type}${!field.isRequired ? '.nullish()' : ''},`);
            });

            scalarFields.forEach((field) => {
              if (field.isList) { // List cannot be optional
                writer.writeLine(`${field.name}: z.${field.zodType}().array(),`);

                return;
              }

              writer.writeLine(`${field.name}: z.${field.zodType}()${!field.isRequired ? '.nullish()' : ''},`);
            });
          });

          writer.writeLine('})');
        },
      },
    ],
  });

  registry.set(item.name, file);

  return file;
};
