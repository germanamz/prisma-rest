import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import { generateService } from './generate-service';

export type GenerateServicesOptions = {
  datamodel: DMMF.Datamodel;
  dir: string;
  project: Project;
  clientPath?: string;
};

export const generateServices = ({ datamodel, dir, project, clientPath }: GenerateServicesOptions) => {
  const index = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });

  datamodel.models.map((model) => {
    const file = generateService({
      project,
      dir,
      model,
      clientPath,
    });

    index.addExportDeclaration({
      moduleSpecifier: `./${file.getBaseNameWithoutExtension()}`,
    });
  });

  return index;
};
