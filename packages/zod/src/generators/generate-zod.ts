import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateDatamodel } from './datamodel/generate-datamodel';
import path from 'path';
import { generateSchema } from './schema/generate-schema';
import { generateNamespace } from './helpers/generate-namespace';

export type GenerateZodOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Map<string, SourceFile>;
};

export const generateZod = ({ project, dmmf, dir, registry }: GenerateZodOptions) => {
  const indexFile = project.createSourceFile(path.join(dir, 'index.ts'), undefined, { overwrite: true });
  const datamodelFile = generateDatamodel({
    project,
    dir: path.join(dir, 'datamodel'),
    dmmf,
    registry,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, datamodelFile.getDirectoryPath())}`,
  });

  const schemaFile = generateSchema({
    project,
    dir: path.join(dir, 'schema'),
    dmmf,
    registry,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, schemaFile.getDirectoryPath())}`,
  });

  return indexFile;
};
