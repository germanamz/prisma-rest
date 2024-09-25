import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import path from 'path';
import { ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateDatamodelEnums } from './generate-datamodel-enums';
import { generateModels } from './generate-models';

export type GenerateDatamodelOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Registry;
  importQueue: ImportQueue;
};

export const generateDatamodel = ({
  project, dir, dmmf, registry, importQueue,
}: GenerateDatamodelOptions) => {
  const indexFile = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });
  const enumsFile = generateDatamodelEnums({
    project,
    dir: path.join(dir, 'enums'),
    registry,
    importQueue,
    dmmf,
  });
  const typesFile = generateModels({
    project,
    dir: path.join(dir, 'types'),
    models: dmmf.datamodel.types,
    registry,
    importQueue,
    dmmf,
  });
  const modelsFile = generateModels({
    project,
    dir: path.join(dir, 'models'),
    models: dmmf.datamodel.models,
    registry,
    importQueue,
    dmmf,
  });

  if (enumsFile) {
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${path.relative(dir, enumsFile.getDirectoryPath())}`,
    });
  }

  if (typesFile) {
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${path.relative(dir, typesFile.getDirectoryPath())}`,
    });
  }

  if (modelsFile) {
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${path.relative(dir, modelsFile.getDirectoryPath())}`,
    });
  }

  return indexFile;
};
