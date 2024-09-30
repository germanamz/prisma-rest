import { Project } from 'ts-morph';
import { generateNamespace, GenerateNamespaceOptions } from '../src';

const fromFile = {
  getFilePath: jest.fn().mockReturnValue('/src/index.ts'),
  addExportDeclaration: jest.fn(),
};
const createSourceFileMock = jest.fn().mockReturnValue(fromFile);
const exportFileMock = jest.fn();

jest.mock('../src/create-source-file', () => ({
  __esModule: true,
  createSourceFile: (...args: any) => createSourceFileMock(...args),
}));
jest.mock('../src/export-file', () => ({
  __esModule: true,
  exportFile: (...args: any) => exportFileMock(...args),
}));

describe('generateNamespace', () => {
  it('should throw if no handler or generator', () => {
    const options: GenerateNamespaceOptions<any> = {
      dir: 'src',
      dmmf: {} as any,
      importQueue: new Map(),
      registry: new Map(),
      project: {} as any,
    };

    expect(() => generateNamespace(options)).toThrow();
  });

  it('should handled generated files', () => {
    const generatedFiles = [
      {
        getBaseName: jest.fn().mockReturnValue('index.ts'),
        getFilePath: jest.fn().mockReturnValue('/src/lib/index.ts'),
      },
      {
        getBaseName: jest.fn().mockReturnValue('index.ts'),
        getFilePath: jest.fn().mockReturnValue('/src/helpers/file.ts'),
      },
      undefined,
      null,
    ];
    const options: GenerateNamespaceOptions<any> = {
      dir: 'src',
      dmmf: {} as any,
      importQueue: new Map(),
      registry: new Map(),
      project: {} as Project,
      generator: jest.fn().mockReturnValue(generatedFiles),
    };
    const file = generateNamespace(options);

    expect(file).toEqual(fromFile);
    expect(options.generator).toBeCalledWith({
      item: null,
      dir: options.dir,
      dmmf: options.dmmf,
      importQueue: options.importQueue,
      registry: options.registry,
      project: options.project,
    });
    expect(exportFileMock).toHaveBeenNthCalledWith(
      1,
      {
        from: fromFile,
        target: generatedFiles[0],
      },
    );
    expect(exportFileMock).toHaveBeenNthCalledWith(
      2,
      {
        from: fromFile,
        target: generatedFiles[1],
      },
    );
  });

  it('should do nothing with no generated files', () => {
    const options: GenerateNamespaceOptions<any> = {
      dir: 'src',
      dmmf: {} as any,
      importQueue: new Map(),
      registry: new Map(),
      project: {} as Project,
      generator: jest.fn().mockReturnValue([]),
    };
    const file = generateNamespace(options);

    expect(file).toEqual(undefined);
    expect(options.generator).toBeCalledWith({
      item: null,
      dir: options.dir,
      dmmf: options.dmmf,
      importQueue: options.importQueue,
      registry: options.registry,
      project: options.project,
    });
    expect(exportFileMock).not.toHaveBeenCalled();
  });

  it('should handle each item', () => {
    const items = [
      { path: '/src/helpers/file.ts', name: 'file.ts' },
      { path: '/src/lib/index.ts', name: 'index.ts' },
    ];
    const generatedFiles: any = [];
    const options: GenerateNamespaceOptions<any> = {
      dir: 'src',
      dmmf: {} as any,
      importQueue: new Map(),
      registry: new Map(),
      project: {} as Project,
      items,
      handler: jest.fn().mockImplementation(({ item: { path, name } }) => {
        const f = {
          getBaseName: jest.fn().mockReturnValue(name),
          getFilePath: jest.fn().mockReturnValue(path),
        };

        generatedFiles.push(f);

        return f;
      }),
    };
    const file = generateNamespace(options);

    expect(file).toEqual(fromFile);
    expect(options.handler).toHaveBeenNthCalledWith(
      1,
      {
        item: items[0],
        dir: options.dir,
        dmmf: options.dmmf,
        importQueue: options.importQueue,
        registry: options.registry,
        project: options.project,
      },
    );
    expect(options.handler).toHaveBeenNthCalledWith(
      2,
      {
        item: items[1],
        dir: options.dir,
        dmmf: options.dmmf,
        importQueue: options.importQueue,
        registry: options.registry,
        project: options.project,
      },
    );
    expect(exportFileMock).toHaveBeenNthCalledWith(
      1,
      {
        from: fromFile,
        target: generatedFiles[0],
      },
    );
    expect(exportFileMock).toHaveBeenNthCalledWith(
      2,
      {
        from: fromFile,
        target: generatedFiles[1],
      },
    );
  });
});
