import { Project, SourceFile } from 'ts-morph';
import { createSourceFile } from './create-source-file';
import { exportFile } from './export-file';

export type NamespaceHandlerOptions<T extends readonly any[]> = {
  dir: string;
  project: Project;
  items: T,
  handler: (item: T[number]) => SourceFile | undefined;
};

export const namespaceHandler = <T extends readonly any[]>(options: NamespaceHandlerOptions<T>) => {
  const {
    dir,
    project,
    items,
    handler,
  } = options;

  if (!items.length) {
    return;
  }

  const file = createSourceFile({ dir, project, name: 'index' });

  items.forEach((item) => {
    const sourceFile = handler(item);

    if (sourceFile) {
      exportFile({ from: file, target: sourceFile });
    }
  });

  return file;
};
