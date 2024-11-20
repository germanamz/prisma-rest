import { DMMF } from '@prisma/generator-helper';
import { Project, VariableDeclarationKind } from 'ts-morph';
import { normalizeFilename, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateDatamodelEnumOptions = {
  dir: string;
  project: Project;
  item: DMMF.DatamodelEnum;
  registry: Registry;
};

// TODO: Use MarshalDocument
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
              writer.write(`"${value.name}",`);
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
