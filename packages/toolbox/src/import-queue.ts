import { SourceFile } from 'ts-morph';
import path from 'path';
import { Registry } from './registry';

/**
 * A map of source files to a set of import identifiers.
 */
export type ImportQueue = Map<SourceFile, Set<string>>;

export const addToImportQueue = (q: ImportQueue, sourceFile: SourceFile, identifiers: string[]) => {
  const identifierSet = q.get(sourceFile) || new Set<string>();

  identifiers.forEach((identifier) => identifierSet.add(identifier));

  q.set(sourceFile, identifierSet);
};

export const executeImportQueue = (q: ImportQueue, registry: Registry) => {
  for (const [sourceFile, imports] of q.entries()) {
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
};
