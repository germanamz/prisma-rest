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
  const lazyFields = item.fields.filter((field) => field.kind === 'object' && !field.relationName);

  file.addVariableStatement({
    isExported: !lazyFields.length,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: lazyFields.length ? 'baseSchema' : item.name,
        initializer: (writer) => {
          writer.writeLine('z.object({');

          writer.indent(() => {
            fields.forEach((field) => {
              if (field.kind === 'enum') {
                addToImportQueue(importQueue, file, [field.type]);

                writer.writeLine(`${field.name}: ${field.type}${field.isList ? '.array()' : ''}${!field.isRequired ? '.nullish()' : ''},`);

                return;
              }

              const typeName = prismaToZodScalar(field.type as PrismaScalar);

              writer.writeLine(`${field.name}: z.${typeName}()${field.isList ? '.array()' : ''}${!field.isRequired ? '.nullish()' : ''},`);
            });
          });

          writer.writeLine('})');
        },
      },
    ],
  });

  registry.set(item.name, file);

  if (!lazyFields.length) {
    return file;
  }

  file.addTypeAlias({
    name: 'BaseSchema',
    type: (writer) => {
      writer.write('z.infer<typeof baseSchema> & {');
      writer.indent(() => {
        lazyFields.forEach((field) => {
          writer.writeLine(`${field.name}${!field.isRequired ? '?' : ''}: z.infer<typeof ${field.type}>${field.isList ? '[]' : ''}${!field.isRequired ? ' | null' : ''};`);
        });
      });

      writer.writeLine('}');
    },
  });

  file.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: item.name,
        type: 'z.ZodType<BaseSchema>',
        initializer: (writer) => {
          writer.writeLine('baseSchema.extend({');

          writer.indent(() => {
            lazyFields.forEach((field) => {
              addToImportQueue(importQueue, file, [field.type]);

              writer.writeLine(`${field.name}: z.lazy(() => ${field.type}${field.isList ? '.array()' : ''}${!field.isRequired ? '.nullish()' : ''}),`);
            });
          });

          writer.writeLine('})');
        },
      },
    ],
  });

  return file;
};
