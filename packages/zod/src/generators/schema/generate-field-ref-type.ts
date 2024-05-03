import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { normalizeFilename } from '../../helpers/normalize-filename';
import { genPrismaZod } from '../../helpers/gen-prisma-zod';
import { PrismaScalar } from '../../constants/prisma-scalars';
import { addToImportQueue, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateFieldRefTypeOptions = {
  project: Project;
  dir: string;
  item: DMMF.FieldRefType;
  registry: Registry;
  importQueue: ImportQueue;
};

export const generateFieldRefType = ({ project, dir, item, importQueue, registry }: GenerateFieldRefTypeOptions) => {
  const file = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });
  const isRef = item.name.includes('Ref');

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
          if (!isRef) {
            writer.write('z.union([');
          }

          writer.indent(() => {
            writer.indent(() => {
              if (item.allowTypes.length > 1) {
                writer.write('z.union([');
                writer.newLine();
              }

              item.allowTypes.forEach((allowType, index) => {
                if (allowType.location === 'scalar') {
                  writer.write(`${genPrismaZod({
                    type: allowType.type as PrismaScalar,
                    isList: allowType.isList,
                  })}${item.allowTypes.length > 1 ? ',' : ''}`);
                  writer.newLine();

                  return;
                }

                addToImportQueue(importQueue, file, [allowType.type]);

                writer.write(`${allowType.type}${item.allowTypes.length > 1 ? ',' : ''}`);
                writer.newLine();
              });

              if (item.allowTypes.length > 1) {
                writer.write(']),');
                writer.newLine();
              }
            });

            if (isRef) {
              return;
            }

            writer.writeLine('z.object({');

            item.fields.forEach((field) => {
              writer.writeLine(`${field.name}: `);

              if (field.inputTypes.length > 1) {
                writer.write('z.union([');
              }

              writer.indent(() => {
                field.inputTypes.forEach((inputType, index) => {
                  if (inputType.location === 'scalar') {
                    writer.write(`${genPrismaZod({
                      type: inputType.type as PrismaScalar,
                      isList: inputType.isList,
                    })},`);

                    return;
                  }

                  addToImportQueue(importQueue, file, [inputType.type]);

                  writer.write(`${inputType.type}${inputType.isList ? '.array()' : ''},`);
                });
              });

              if (field.inputTypes.length > 1) {
                writer.write('])');
              }

              writer.write(`${!field.isRequired ? '.optional()' : ''}${field.isNullable ? '.nullable()' : ''}${field.inputTypes.length > 1 ? ',' : ''}`);
            });

            writer.write('})');
          });

          if (!isRef) {
            writer.write(`])`);
          }
        },
      },
    ],
  });

  registry.set(item.name, file);

  return file;
};
