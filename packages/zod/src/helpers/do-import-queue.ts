import path from 'path';
import { SourceFile } from 'ts-morph';

export type DoImportQueueOptions = {
  queue: Map<SourceFile, Set<string>>;
  registry: Map<string, SourceFile>;
};

export const doImportQueue = ({ queue, registry }: DoImportQueueOptions) => {
  for (const [sourceFile, imports] of queue.entries()) {
    for (const item of imports) {
      // TODO: Group imports
      const itemFile = registry.get(item)!;
      // Import path is './' when directories are the same
      const moduleSpecifier = sourceFile.getDirectoryPath() === itemFile.getDirectoryPath()
        ? `./${itemFile.getBaseNameWithoutExtension()}`
        : path.relative(sourceFile.getDirectoryPath(), itemFile.getDirectoryPath());

      sourceFile.addImportDeclaration({
        moduleSpecifier,
        namedImports: [item],
      });
    }
  }
};
