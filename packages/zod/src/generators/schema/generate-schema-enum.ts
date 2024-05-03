import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { normalizeFilename } from '../../helpers/normalize-filename';
import { Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateSchemaEnumOptions = {
  project: Project;
  dir: string;
  item: DMMF.SchemaEnum;
  registry: Registry;
};

export const generateSchemaEnum = ({ project, dir, item, registry }: GenerateSchemaEnumOptions) => {
  const file = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });

  file.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  file.addVariableStatement({
    isExported: true,
    declarations: [
      {
        name: item.name,
        initializer: writer => {
          writer.writeLine(`z.enum([`);

          writer.indent(() => {
            item.values.forEach(value => {
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
