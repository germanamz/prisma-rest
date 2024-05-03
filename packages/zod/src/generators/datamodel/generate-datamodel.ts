import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateDatamodelEnums } from './generate-datamodel-enums';
import path from 'path';
import { generateModels } from './generate-models';
import { executeImportQueue, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateDatamodelOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
  importQueue: ImportQueue;
};

export const generateDatamodel = ({ project, dir, dmmf, registry, importQueue }: GenerateDatamodelOptions) => {
  const indexFile = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });
  const enumsFile = generateDatamodelEnums({
    project,
    dir: path.join(dir, 'enums'),
    enums: dmmf.datamodel.enums,
    registry,
    importQueue,
  });
  const typesFile = generateModels({
    project,
    dir: path.join(dir, 'types'),
    models: dmmf.datamodel.types,
    registry,
    importQueue,
  });
  const modelsFile = generateModels({
    project,
    dir: path.join(dir, 'models'),
    models: dmmf.datamodel.models,
    registry,
    importQueue,
  });

  executeImportQueue(importQueue, registry);

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, enumsFile.getDirectoryPath())}`,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, typesFile.getDirectoryPath())}`,
  });

  indexFile.addExportDeclaration({
    moduleSpecifier: `./${path.relative(dir, modelsFile.getDirectoryPath())}`,
  });


  return indexFile;
};
