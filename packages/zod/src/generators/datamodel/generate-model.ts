import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import { normalizeFilename } from '../../helpers/normalize-filename';
import { PrismaScalar } from '../../constants/prisma-scalars';
import { prismaToZodScalar } from '../../helpers/prisma-to-zod-scalar';

export type GenerateModelOptions = {
  dir: string;
  model: DMMF.Model;
  project: Project;
  importQueue: Map<SourceFile, Set<string>>;
};

export const generateModel = ({
  dir,
  model,
  project,
  importQueue,
}: GenerateModelOptions) => {
  const modelFile = project.createSourceFile(`${dir}/${normalizeFilename(model.name)}.ts`, undefined, { overwrite: true });

  modelFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  const fields = model.fields.filter((field) => field.kind === 'scalar' || field.kind === 'enum');
  const lazyFields = model.fields.filter((field) => field.kind === 'object');

  modelFile.addVariableStatement({
    isExported: !lazyFields.length,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: lazyFields.length ? 'baseSchema' : model.name,
        initializer: (writer) => {
          writer.writeLine(`z.object({`);

          writer.indent(() => {
            fields.forEach((field) => {
              if (field.kind === 'enum') {
                const importQ = importQueue.get(modelFile) || new Set<string>();

                importQ.add(field.type);

                importQueue.set(modelFile, importQ);

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

  if (lazyFields.length) {
    modelFile.addTypeAlias({
      name: 'BaseSchema',
      type: (writer) => {
        writer.write('z.infer<typeof baseSchema> & {');
        writer.indent(() => {
          lazyFields.forEach((field) => {
            writer.writeLine(`${field.name}${!field.isRequired ? '?' : ''}: z.infer<typeof ${field.type}>${field.isList ? '[]' : ''}${!field.isRequired ? ' | null' : ''},`);
          });
        });

        writer.writeLine('}');
      },
    });

    modelFile.addVariableStatement({
      isExported: true,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: model.name,
          type: 'z.ZodType<BaseSchema>',
          initializer: (writer) => {
            writer.writeLine(`baseSchema.extend({`);

            writer.indent(() => {
              lazyFields.forEach((field) => {
                const importQ = importQueue.get(modelFile) || new Set<string>();

                importQ.add(field.type);

                importQueue.set(modelFile, importQ);

                writer.writeLine(`${field.name}: z.lazy(() => ${field.type}${field.isList ? '.array()' : ''}${!field.isRequired ? '.nullish()' : ''}),`);
              });
            });

            writer.writeLine('})');
          },
        },
      ],
    });
  }

  return modelFile;
};
