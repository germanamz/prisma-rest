import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateDatamodel } from './datamodel/generate-datamodel';
import path from 'path';
import { Registry } from '@germanamz/prisma-rest-toolbox';
import { generateCrud } from './crud/generate-crud';

export type GenerateZodOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
};

export const generateZod = ({ project, dmmf, dir, registry }: GenerateZodOptions) => {
  const importQueue = new Map<SourceFile, Set<string>>();
  const indexFile = project.createSourceFile(path.join(dir, 'index.ts'), undefined, { overwrite: true });
  const datamodelFile = generateDatamodel({
    project,
    dir: path.join(dir, 'datamodel'),
    dmmf,
    registry,
    importQueue,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, datamodelFile.getDirectoryPath())}`,
  });

  const crudFile = generateCrud({
    project,
    dir: path.join(dir, 'crud'),
    dmmf,
    registry,
    importQueue,
  });

  if (crudFile) {
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${path.relative(dir, crudFile.getDirectoryPath())}`,
    });
  }

  return indexFile;
};
