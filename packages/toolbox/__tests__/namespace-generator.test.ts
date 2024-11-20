import { Project, StatementStructures, StructureKind } from 'ts-morph';
import { createSourceFile, namespaceGenerator, assertProjectSnapshot } from '../src';

describe('namespaceGenerator', () => {
  const makeProject = () => new Project({
    useInMemoryFileSystem: true,
  });

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
          content: 'export const test = 1;',
        }),
        undefined,
      ],
    })!;
    const structure = indexFile.getStructure();

    expect(indexFile.getFilePath()).toEqual('/namespace/index.ts');
    expect(structure.statements).toHaveLength(1);
    expect((structure.statements as StatementStructures[])[0]).toEqual({
      kind: StructureKind.ExportDeclaration,
      moduleSpecifier: './test',
      isTypeOnly: false,
      namedExports: [],
      namespaceExport: undefined,
      attributes: undefined,
    });
    assertProjectSnapshot(project);
  });

  it('should return undefined if no files are generated', () => {
    const project = makeProject();
    const indexFile = namespaceGenerator({
      project,
      dir: 'namespace',
      generator: () => [],
    });

    expect(indexFile).toBeUndefined();
    assertProjectSnapshot(project);
  });
});
