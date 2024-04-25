import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { normalizeFilename } from '../../helpers/normalize-filename';
import { genPrismaZod } from '../../helpers/gen-prisma-zod';
import { PrismaScalar } from '../../constants/prisma-scalars';

export type GenerateFieldRefTypeOptions = {
  project: Project;
  dir: string;
  item: DMMF.FieldRefType;
  importQueue: Map<SourceFile, Set<string>>;
};

export const generateFieldRefType = ({ project, dir, item, importQueue }: GenerateFieldRefTypeOptions) => {
  const fieldRefFile = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });

  fieldRefFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  fieldRefFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: item.name,
        initializer: (writer) => {
          writer.write('z.union([');

          writer.indent(() => {
            writer.indent(() => {
              if (item.allowTypes.length > 1) {
                writer.write('z.union([');
              }

              item.allowTypes.forEach((allowType, index) => {
                if (allowType.location === 'scalar') {
                  writer.writeLine(`${genPrismaZod({
                    type: allowType.type as PrismaScalar,
                    isList: allowType.isList,
                  })},`);

                  return;
                }

                const importQ = importQueue.get(fieldRefFile) || new Set<string>();

                importQ.add(allowType.type);

                importQueue.set(fieldRefFile, importQ);

                writer.write(`${allowType.type},`);
              });

              if (item.allowTypes.length > 1) {
                writer.write(']),');
              }
            });

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

                  const importQ = importQueue.get(fieldRefFile) || new Set<string>();

                  importQ.add(inputType.type);

                  importQueue.set(fieldRefFile, importQ);

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


          writer.write(`])`);
        },
      },
    ],
  });

  return fieldRefFile;
};
