import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { normalizeFilename } from '../../helpers/normalize-filename';
import { genPrismaZod } from '../../helpers/gen-prisma-zod';
import { PrismaScalar } from '../../constants/prisma-scalars';
import { prismaToTsScalar } from '../../helpers/prisma-to-ts-scalar';

export type GenerateInputOptions = {
  project: Project;
  dir: string;
  item: DMMF.InputType;
  importQueue: Map<SourceFile, Set<string>>;
};

export const generateInput = ({ dir, project, item, importQueue }: GenerateInputOptions) => {
  const inputFile = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });
  const fields = item.fields.filter((field) => !field.inputTypes.some((inputType) => inputType.location === 'inputObjectTypes'));
  const lazyFields = item.fields.filter((field) => field.inputTypes.some((inputType) => inputType.location === 'inputObjectTypes'));

  inputFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  inputFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: !lazyFields.length,
    declarations: [
      {
        name: lazyFields.length ? `baseSchema` : item.name,
        initializer: (writer) => {
          writer.writeLine(`z.object({`);

          writer.indent(() => {
            fields.forEach((field) => {
              writer.writeLine(`${field.name}:`);

              if (field.inputTypes.length > 1) {
                writer.write(' z.union([');
              }

              writer.indent(() => {
                field.inputTypes.forEach((inputType) => {
                  if (inputType.location === 'scalar') {
                    writer.write(` ${genPrismaZod({
                      type: inputType.type as PrismaScalar,
                      isList: inputType.isList,
                    })}${field.inputTypes.length > 1 ? ',' : ''}`);
                    return;
                  }

                  const importQ = importQueue.get(inputFile) || new Set<string>();

                  importQ.add(inputType.type);

                  importQueue.set(inputFile, importQ);

                  writer.write(` ${inputType.type}${inputType.isList ? '.array()' : ''}${field.inputTypes.length > 1 ? ',' : ''}`);
                });
              });

              if (field.inputTypes.length > 1) {
                writer.write('])');
              }

              writer.write(`${!field.isRequired ? '.optional()' : ''}${field.isNullable ? '.nullable()' : ''},`);
            });
          });

          writer.write('})');
        },
      },
    ],
  });

  if (!lazyFields.length) {
    return inputFile;
  }

  inputFile.addTypeAlias({
    name: 'BaseSchema',
    type: (writer) => {
      writer.write('z.infer<typeof baseSchema> & {');

      writer.indent(() => {
        lazyFields.forEach((field) => {
          writer.writeLine(`${field.name}${!field.isRequired ? '?' : ''}:`)

          field.inputTypes.forEach((inputType) => {
            if (inputType.type === 'Null') {
              return;
            }

            const typeName = inputType.location === 'scalar' ? prismaToTsScalar(inputType.type as PrismaScalar) : `z.infer<typeof ${inputType.type}>`;

            writer.writeLine(` | ${typeName}${inputType.isList ? '[]' : ''}`);
          });

          writer.write(`${field.isNullable ? ' | null' : ''};`);
        });
      });

      writer.writeLine('}');
    },
  });

  inputFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: item.name,
        type: 'z.ZodType<BaseSchema>',
        initializer: (writer) => {
          writer.writeLine(`baseSchema.extend({`);

          writer.indent(() => {
            lazyFields.forEach((field) => {
              writer.writeLine(`${field.name}: z.lazy(() =>`);

              if (field.inputTypes.length > 1) {
                writer.write(' z.union([');
              }

              writer.indent(() => {
                field.inputTypes.forEach((inputType) => {
                  if (inputType.location === 'scalar') {
                    if (inputType.type === 'Null') {
                      return;
                    }

                    writer.write(` ${genPrismaZod({
                      type: inputType.type as PrismaScalar,
                      isList: inputType.isList,
                    })}${field.inputTypes.length > 1 ? ',' : ''}`);

                    return;
                  }

                  if (inputType.type !== item.name) {
                    const importQ = importQueue.get(inputFile) || new Set<string>();

                    importQ.add(inputType.type);

                    importQueue.set(inputFile, importQ);
                  }

                  writer.write(` ${inputType.type}${inputType.isList ? '.array()' : ''}${field.inputTypes.length > 1 ? ',' : ''}`);
                });
              });

              if (field.inputTypes.length > 1) {
                writer.write('])');
              }

              writer.write(`${!field.isRequired ? '.optional()' : ''}${field.isNullable ? '.nullable()' : ''}),`);
            });
          });

          writer.write('})');
        },
      },
    ],
  });

  return inputFile;
};
