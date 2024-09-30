import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { ImportQueue } from './import-queue';
import { Registry } from './registry';
import { createSourceFile } from './create-source-file';
import { exportFile } from './export-file';

export type GenerateNamespaceHandlerOptions<T> = {
  item: T,
  dir: string;
  project: Project;
  importQueue: ImportQueue;
  registry: Registry;
  dmmf: DMMF.Document;
};

export type GenerateNamespaceOptions<T extends readonly any[]> = {
  dir: string;
  project: Project;
  registry: Registry;
  importQueue: ImportQueue;
  dmmf: DMMF.Document;
  items?: T;
  handler?: (options: GenerateNamespaceHandlerOptions<T[number]>) => SourceFile | undefined;
  generator?: (options: GenerateNamespaceHandlerOptions<null>) => (SourceFile | undefined)[];
};

export const generateNamespace = <T extends readonly any[]>(
  options: GenerateNamespaceOptions<T>,
) => {
  const {
    dir,
    project,
    items,
    handler,
    registry,
    importQueue,
    generator,
    dmmf,
  } = options;

  if ((!handler && !generator) || (handler && generator)) {
    throw new Error('Either handler or generator must be provided');
  }

  if (generator) {
    const sourceFiles = generator({
      item: null,
      dir,
      project,
      importQueue,
      registry,
      dmmf,
    });

    if (!sourceFiles?.length) {
      return;
    }

    const file = createSourceFile({ dir, project, name: 'index' });

    sourceFiles.forEach((sourceFile) => {
      if (sourceFile) {
        exportFile({ from: file, target: sourceFile });
      }
    });

    return file;
  }

  if (handler && items?.length) {
    const file = createSourceFile({ dir, project, name: 'index' });

    items.forEach((item) => {
      const sourceFile = handler({
        item,
        dir,
        project,
        importQueue,
        registry,
        dmmf,
      });

      if (sourceFile) {
        exportFile({ from: file, target: sourceFile });
      }
    });

    return file;
  }
};
