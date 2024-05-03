import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateInputs } from './generate-inputs';
import path from 'path';
import { generateFieldRefTypes } from './generate-field-ref-types';
import { generateSchemaEnums } from './generate-schema-enums';
import { executeImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateSchemaOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
};

export const generateSchema = ({ project, dir, dmmf, registry }: GenerateSchemaOptions) => {
  const indexFile = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });
  const importQueue = new Map<SourceFile, Set<string>>();
  const enumsFile = generateSchemaEnums({
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

  executeImportQueue(importQueue, registry);

  return indexFile;
};
