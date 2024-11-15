import { Project, StatementStructures, StructureKind } from 'ts-morph';
import path from 'path';
import { createSourceFile, namespaceGenerator } from '../src';

describe('namespaceGenerator', () => {
  const makeProject = () => new Project({});

  it('should import the generated files correctly', () => {
    const project = makeProject();
    const indexFile = namespaceGenerator({
      project,
      dir: 'namespace',
      generator: () => [
        createSourceFile({
          project,
          dir: 'namespace',
          name: 'test',
        }),
        undefined,
      ],
    })!;
    const structure = indexFile.getStructure();

    expect(indexFile.getFilePath()).toEqual(path.resolve('namespace/index.ts'));
    expect(structure.statements).toHaveLength(1);
    expect((structure.statements as StatementStructures[])[0]).toEqual({
      kind: StructureKind.ExportDeclaration,
      moduleSpecifier: './test',
      isTypeOnly: false,
      namedExports: [],
      namespaceExport: undefined,
      attributes: undefined,
    });
    expect(indexFile.getFullText()).toMatchSnapshot();
  });

  it('should return undefined if no files are generated', () => {
    const project = makeProject();
    const indexFile = namespaceGenerator({
      project,
      dir: 'namespace',
      generator: () => [],
    });

    expect(indexFile).toBeUndefined();
  });
});
