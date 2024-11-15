import { DMMF } from '@prisma/generator-helper';
import { CodeBlockWriter, Project, VariableDeclarationKind } from 'ts-morph';
import { createSourceFile, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';
import { genFieldZodType } from '../../helpers/gen-field-zod-type';

type GenerateInputOptions = {
  dmmf: DMMF.Document;
  project: Project;
  dir: string;
  registry: Registry;
  importQueue: ImportQueue;
  model: DMMF.Model;
  suffix: string;
  isOptional: boolean;
};

export const generateInput = (options: GenerateInputOptions) => {
  const {
    project,
    dir,
    model,
    importQueue,
    registry,
    suffix,
    isOptional,
  } = options;
  const name = `${model.name}${suffix}`;
  const sourceFile = createSourceFile({
    project,
    dir,
    name,
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name,
        initializer: (writer: CodeBlockWriter) => {
          writer.write('z.object({');

          for (const field of model.fields) {
            if (['scalar', 'enum'].includes(field.kind)) {
              // only allow saclar and enum fields
              // TODO: Add support to disable write based on config
              writer.writeLine(`${field.name}: ${genFieldZodType({
                field,
                sourceFile,
                importQueue,
                isOptional: isOptional ? true : field.hasDefaultValue,
              })},`);
            }
          }

          writer.write('}).strict()');
        },
      },
    ],
  });

  registry.set(name, sourceFile);

  return sourceFile;
};
