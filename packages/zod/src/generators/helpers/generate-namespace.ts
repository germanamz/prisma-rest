import { Project, SourceFile } from 'ts-morph';
import { read } from 'node:fs';

export type GenerateNamespaceOptions<T extends readonly any[]> = {
  dir: string;
  project: Project;
  registry: Map<string, SourceFile>;
  importQueue: Map<SourceFile, Set<string>>;
  items?: T;
  handler: (options: { item: T[number], dir: string; project: Project; importQueue: Map<SourceFile, Set<string>>; }) => SourceFile;
};

export const generateNamespace = <T extends readonly any[]>({ dir, project, items, handler, registry, importQueue }: GenerateNamespaceOptions<T>) => {
  const file = project.createSourceFile(`${dir}/index.ts`, undefined, { overwrite: true });

  items?.forEach((item) => {
    const sourceFile = handler({ item, dir, project, importQueue });

    file.addExportDeclaration({
      moduleSpecifier: `./${sourceFile.getBaseNameWithoutExtension()}`,
    });

    registry.set(item.name, sourceFile);
  });

  return file;
};
