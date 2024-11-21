import { StatementStructures, StructureKind } from 'ts-morph';
import { assertProjectSnapshot, getMockDir, makeMockProject } from 'test-lib';
import { createSourceFile, namespaceGenerator } from '../src';

describe('namespaceGenerator', () => {
  it('should import the generated files correctly', () => {
    const project = makeMockProject();
    const indexFile = namespaceGenerator({
      project,
      dir: getMockDir(),
      generator: () => [
        createSourceFile({
          project,
          dir: getMockDir(),
          name: 'test',
          content: 'export const test = 1;',
        }),
        undefined,
      ],
    })!;
    const structure = indexFile.getStructure();

    expect(indexFile.getFilePath()).toEqual(`${getMockDir()}/index.ts`);
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
    const project = makeMockProject();
    const indexFile = namespaceGenerator({
      project,
      dir: getMockDir(),
      generator: () => [],
    });

    expect(indexFile).toBeUndefined();
    assertProjectSnapshot(project);
  });
});
