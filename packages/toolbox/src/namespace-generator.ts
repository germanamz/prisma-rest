import { Project, SourceFile } from 'ts-morph';
import { createSourceFile } from './create-source-file';
import { exportFile } from './export-file';

export type NamespaceGeneratorOptions = {
  dir: string;
  project: Project;
  generator: () => (SourceFile | undefined)[];
};

export const namespaceGenerator = (options: NamespaceGeneratorOptions) => {
  const {
    dir,
    project,
    generator,
  } = options;
  const sourceFiles = generator();

  const file = createSourceFile({ dir, project, name: 'index' });

  if (!sourceFiles.length) {
    return;
  }

  sourceFiles.forEach((sourceFile) => {
    if (sourceFile) {
      exportFile({ from: file, target: sourceFile });
    }
  });

  return file;
};
