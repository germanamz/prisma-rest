import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateEnum } from './generate-enum';

export type GenerateEnumsOptions = {
  dir: string;
  project: Project;
  enums: DMMF.Document['datamodel']['enums'];
  registry: Map<string, SourceFile>;
};

export const generateEnums = ({ dir, project, enums, registry }: GenerateEnumsOptions) => {
  const indexFile = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });

  enums.forEach((enumDef) => {
    const enumFile = generateEnum({
      dir,
      enumDef,
      project,
    });

    registry.set(enumDef.name, indexFile);

    indexFile.addExportDeclaration({
      moduleSpecifier: `./${enumFile.getBaseNameWithoutExtension()}`,
    });
  });

  return indexFile;
};
