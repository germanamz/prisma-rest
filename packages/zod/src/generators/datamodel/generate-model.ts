import { DMMF } from '@prisma/generator-helper';
import { Project, VariableDeclarationKind } from 'ts-morph';
import {
  addToImportQueue, ImportQueue, normalizeFilename, Registry,
} from '@germanamz/prisma-rest-toolbox';
import { PrismaScalar } from '../../constants/prisma-scalars';
import { prismaToZodScalar } from '../../helpers/prisma-to-zod-scalar';

export type GenerateModelOptions = {
  dir: string;
  item: DMMF.Model;
  project: Project;
  importQueue: ImportQueue;
  registry: Registry;
};

// TODO: Use MarshalDocument
export const generateModel = ({
  dir,
  item,
  project,
  importQueue,
  registry,
}: GenerateModelOptions) => {
  const file = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });

  file.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  const fields = item.fields.filter((field) => field.kind === 'scalar' || field.kind === 'enum');

  file.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: item.name,
        initializer: (writer) => {
          writer.writeLine('z.object({');

          writer.indent(() => {
            fields.forEach((field) => {
              if (field.kind === 'enum') {
                addToImportQueue(importQueue, file, [field.type]);

                if (field.isList) { // List cannot be optional
                  writer.writeLine(`${field.name}: ${field.type}.array(),`);

                  return;
                }

                writer.writeLine(`${field.name}: ${field.type}${!field.isRequired ? '.nullish()' : ''},`);

                return;
              }

              const typeName = prismaToZodScalar(field.type as PrismaScalar);

              if (field.isList) { // List cannot be optional
                writer.writeLine(`${field.name}: z.${typeName}().array(),`);

                return;
              }

              writer.writeLine(`${field.name}: z.${typeName}()${!field.isRequired ? '.nullish()' : ''},`);
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
