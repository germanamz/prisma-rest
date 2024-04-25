import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateInputs } from './generate-inputs';
import path from 'path';
import { doImportQueue } from '../../helpers/do-import-queue';
import { generateFieldRefTypes } from './generate-field-ref-types';
import { generateEnums } from './generate-enums';

export type GenerateSchemaOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Map<string, SourceFile>;
};

export const generateSchema = ({ project, dir, dmmf, registry }: GenerateSchemaOptions) => {
  const indexFile = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });
  const importQueue = new Map<SourceFile, Set<string>>();
  const enumsFile = generateEnums({
    project,
    dir: path.join(dir, 'enums'),
    registry,
    importQueue,
    enumTypes: dmmf.schema.enumTypes,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, enumsFile.getDirectoryPath())}`,
  });

  const fieldRefTypesFile = generateFieldRefTypes({
    project,
    dir: path.join(dir, 'field-ref-types'),
    fieldRefTypes: dmmf.schema.fieldRefTypes,
    registry,
    importQueue,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, fieldRefTypesFile.getDirectoryPath())}`,
  });

  const inputsFile = generateInputs({
    dir: path.join(dir, 'inputs'),
    project,
    registry,
    inputs: dmmf.schema.inputObjectTypes,
    importQueue,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, inputsFile.getDirectoryPath())}`,
  });

  doImportQueue({
    queue: importQueue,
    registry,
  });

  return indexFile;
};
