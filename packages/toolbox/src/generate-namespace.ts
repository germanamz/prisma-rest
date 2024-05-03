import { Project, SourceFile } from 'ts-morph';
import { ImportQueue } from './import-queue';
import { Registry } from './registry';


export type GenerateNamespaceHandlerOptions<T> = {
  item: T,
  dir: string;
  project: Project;
  importQueue: ImportQueue;
  registry: Registry;
};

export type GenerateNamespaceOptions<T extends readonly any[]> = {
  dir: string;
  project: Project;
  registry: Registry;
  importQueue: ImportQueue;
  items?: T;
  handler?: (options: GenerateNamespaceHandlerOptions<T[number]>) => SourceFile;
  generator?: (options: GenerateNamespaceHandlerOptions<null>) => SourceFile[];
};

export const generateNamespace = <T extends readonly any[]>({
  dir,
  project,
  items,
  handler,
  registry,
  importQueue,
  generator,
}: GenerateNamespaceOptions<T>) => {
  const file = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });

  if (generator) {
    const sourceFiles = generator({
      item: null,
      dir,
      project,
      importQueue,
      registry,
    });

    sourceFiles?.forEach((sourceFile) => {
      file.addExportDeclaration({
        moduleSpecifier: `./${sourceFile.getBaseNameWithoutExtension()}`,
      });
    });
  }

  if (handler) {
    items?.forEach((item) => {
      const sourceFile = handler({ item, dir, project, importQueue, registry });

      file.addExportDeclaration({
        moduleSpecifier: `./${sourceFile.getBaseNameWithoutExtension()}`,
      });
    });
  }

  return file;
};
