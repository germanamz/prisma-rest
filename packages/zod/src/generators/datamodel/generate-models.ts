import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { generateModel } from './generate-model';

type GenerateModelsOptions = {
  dir: string;
  project: Project;
  models: DMMF.Document['datamodel']['models'] | DMMF.Document['datamodel']['types'];
  registry: Map<string, SourceFile>;
  importQueue: Map<SourceFile, Set<string>>;
};

export const generateModels = ({
  project,
  dir,
  models,
  registry,
  importQueue,
}: GenerateModelsOptions) => {
  const indexFile = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });

  models.forEach((model) => {
    const modelFile = generateModel({
      project,
      dir,
      model,
      importQueue,
    });

    registry.set(model.name, modelFile);

    indexFile.addExportDeclaration({
      moduleSpecifier: `./${modelFile.getBaseNameWithoutExtension()}`,
    });
  });

  return indexFile;
};
