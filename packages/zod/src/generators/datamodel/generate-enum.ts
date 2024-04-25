import { DMMF } from '@prisma/generator-helper';
import { Project, VariableDeclarationKind } from 'ts-morph';
import { normalizeFilename } from '../../helpers/normalize-filename';

export type GenerateEnumOptions = {
  dir: string;
  project: Project;
  enumDef: DMMF.DatamodelEnum;
};

export const generateEnum = ({ dir, project, enumDef }: GenerateEnumOptions) => {
  const enumFile = project.createSourceFile(`${dir}/${normalizeFilename(enumDef.name)}.ts`, undefined, { overwrite: true });

  enumFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  enumFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: enumDef.name,
        initializer: (writer) => {
          writer.writeLine(`z.enum([`);
          writer.indent(() => {
            enumDef.values.forEach((value) => {
              writer.write(`"${value.name}",`);
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
