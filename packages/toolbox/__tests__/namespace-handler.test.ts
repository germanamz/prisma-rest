import { Project, StatementStructures, StructureKind } from 'ts-morph';
import path from 'path';
import { createSourceFile, namespaceHandler } from '../src';

describe('namespaceHandler', () => {
  const makeProject = () => new Project({});

  it('should import the generated files correctly', () => {
    const project = makeProject();
    const handler = jest.fn((item) => createSourceFile({
      dir: 'namespace',
      name: item.name,
      project,
    }));
    const indexFile = namespaceHandler({
      project,
      dir: 'namespace',
      items: [
        { name: 'test1' },
        { name: 'test2' },
      ],
      handler,
    })!;
    const structure = indexFile.getStructure();

    expect(indexFile.getFilePath()).toEqual(path.resolve('namespace/index.ts'));
    expect(structure.statements).toHaveLength(2);
    expect((structure.statements as StatementStructures[])[0]).toEqual({
      kind: StructureKind.ExportDeclaration,
      moduleSpecifier: './test-1',
      isTypeOnly: false,
      namedExports: [],
      namespaceExport: undefined,
      attributes: undefined,
    });
    expect((structure.statements as StatementStructures[])[1]).toEqual({
      kind: StructureKind.ExportDeclaration,
      moduleSpecifier: './test-2',
      isTypeOnly: false,
      namedExports: [],
      namespaceExport: undefined,
      attributes: undefined,
    });
    expect(handler).toHaveBeenCalledTimes(2);
    expect(indexFile.getFullText()).toMatchSnapshot();
  });

  it('should return undefined if no files are generated', () => {
    const project = makeProject();
    const handler = jest.fn((item) => createSourceFile({
      dir: 'namespace',
      name: item.name,
      project,
    }));
    const indexFile = namespaceHandler({
      project,
      dir: 'namespace',
      items: [],
      handler,
    });

    expect(handler).not.toHaveBeenCalled();
    expect(indexFile).toBeUndefined();
  });
});
