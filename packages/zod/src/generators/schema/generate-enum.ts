import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { normalizeFilename } from '../../helpers/normalize-filename';

export type GenerateEnumOptions = {
  project: Project;
  dir: string;
  item: DMMF.SchemaEnum;
};

export const generateEnum = ({ project, dir, item }: GenerateEnumOptions) => {
  const enumFile = project.createSourceFile(`${dir}/${normalizeFilename(item.name)}.ts`, undefined, { overwrite: true });

  enumFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  enumFile.addVariableStatement({
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

  return enumFile;
};
