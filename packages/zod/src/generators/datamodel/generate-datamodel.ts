import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateEnums } from './generate-enums';
import path from 'path';
import { generateModels } from './generate-models';

export type GenerateDatamodelOptions = {
  project: Project;
  dir: string;
  dmmf: DMMF.Document;
  registry: Map<string, SourceFile>;
};

export const generateDatamodel = ({ project, dir, dmmf, registry }: GenerateDatamodelOptions) => {
  const indexFile = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });
  const importQueue = new Map<SourceFile, Set<string>>();
  const enumsFile = generateEnums({
    project,
    dir: path.join(dir, 'enums'),
    enums: dmmf.datamodel.enums,
    registry,
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

  for (const [sourceFile, imports] of importQueue.entries()) {
    for (const item of imports) {
      // TODO: Group imports
      // Import path is './' when directories are the same
      const moduleSpecifier = sourceFile.getDirectoryPath() === registry.get(item)!.getDirectoryPath()
        ? `./${registry.get(item)!.getBaseNameWithoutExtension()}`
        : path.relative(sourceFile.getDirectoryPath(), registry.get(item)!.getDirectoryPath());

      sourceFile.addImportDeclaration({
        moduleSpecifier,
        namedImports: [item],
      });
    }
  }

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
