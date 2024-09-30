import { SourceFile } from 'ts-morph';
import path from 'node:path';

export type ExportFileOptions = {
  from: SourceFile;
  target: SourceFile;
};

export const exportFile = ({ from, target }: ExportFileOptions) => {
  const isIndex = target.getBaseName().includes('index');
  let importPath = path.relative(path.dirname(from.getFilePath()), target.getFilePath());

  if (!importPath.startsWith('../')) {
    importPath = `./${importPath}`;
  }

  if (isIndex) {
    importPath = path.dirname(importPath);
  }

  from.addExportDeclaration({
    moduleSpecifier: importPath.replace(RegExp(`${path.extname(target.getFilePath())}$`), ''),
  });
};
