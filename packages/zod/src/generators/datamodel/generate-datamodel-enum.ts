import { VariableDeclarationKind } from 'ts-morph';
import { GeneratorContext, normalizeFilename } from '@germanamz/prisma-rest-toolbox';
import { MarshalEnum } from '@germanamz/prisma-rest-marshal';

export type GenerateDatamodelEnumOptions = GeneratorContext & {
  item: MarshalEnum;
};

export const generateDatamodelEnum = ({
  dir, project, item, registry,
}: GenerateDatamodelEnumOptions) => {
  const file = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });

  file.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  file.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: item.name,
        initializer: (writer) => {
          writer.writeLine('z.enum([');
          writer.indent(() => {
            item.values.forEach((value) => {
              writer.write(`"${value}",`);
              writer.newLine();
            });
          });
          writer.write('])');
        },
      },
    ],
  });

  registry.set(item.name, file);

  return file;
};
