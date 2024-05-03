import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { normalizeFilename } from '../../helpers/normalize-filename';
import { genPrismaZod } from '../../helpers/gen-prisma-zod';
import { PrismaScalar } from '../../constants/prisma-scalars';
import { prismaToTsScalar } from '../../helpers/prisma-to-ts-scalar';
import { addToImportQueue, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateInputOptions = {
  project: Project;
  dir: string;
  item: DMMF.InputType;
  importQueue: ImportQueue;
  registry: Registry;
};

export const generateInput = ({ dir, project, item, importQueue, registry }: GenerateInputOptions) => {
  const file = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });
  const fields = item.fields.filter((field) => !field.inputTypes.some((inputType) => inputType.location === 'inputObjectTypes'));
  const lazyFields = item.fields.filter((field) => field.inputTypes.some((inputType) => inputType.location === 'inputObjectTypes'));
  const constrainedFields = item.constraints.fields;

  file.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  file.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: !lazyFields.length,
    declarations: [
      {
        name: lazyFields.length ? `${item.name}baseSchema` : item.name,
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

                  addToImportQueue(importQueue, file, [inputType.type]);

                  writer.write(` ${inputType.type}${inputType.isList ? '.array()' : ''}${field.inputTypes.length > 1 ? ',' : ''}`);
                });
              });

              if (field.inputTypes.length > 1) {
                writer.write('])');
              }

              if (!constrainedFields?.includes(field.name)) {
                writer.write(`${!field.isRequired ? '.optional()' : ''}${field.isNullable ? '.nullable()' : ''},`);
              }
            });
          });

          writer.write('})');
        },
      },
    ],
  });

  registry.set(item.name, file);

  if (!lazyFields.length) {
    return file;
  }

  file.addTypeAlias({
    name: `${item.name}BaseSchema`,
    type: (writer) => {
      writer.write(`z.infer<typeof ${item.name}baseSchema> & {`);

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

  file.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: item.name,
        type: `z.ZodType<${item.name}BaseSchema>`,
        initializer: (writer) => {
          writer.writeLine(`${item.name}baseSchema.extend({`);

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
                    addToImportQueue(importQueue, file, [inputType.type]);
                  }

                  writer.write(` ${inputType.type}${inputType.isList ? '.array()' : ''}${field.inputTypes.length > 1 ? ',' : ''}`);
                });
              });

              if (field.inputTypes.length > 1) {
                writer.write('])');
              }

              if (!constrainedFields?.includes(field.name)) {
                writer.write(`${!field.isRequired ? '.optional()' : ''}${field.isNullable ? '.nullable()' : ''},`);
              }

              writer.write('),')
            });
          });

          writer.write('})');
        },
      },
    ],
  });

  return file;
};
