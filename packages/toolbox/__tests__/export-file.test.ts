import { exportFile, ExportFileOptions } from '../src';

// TODO: Use real project
describe('exportFile', () => {
  it('should create export declaration', () => {
    const options = {
      from: {
        getFilePath: jest.fn().mockReturnValue('/src/index.ts'),
        addExportDeclaration: jest.fn(),
      },
      target: {
        getBaseName: jest.fn().mockReturnValue('file.ts'),
        getFilePath: jest.fn().mockReturnValue('/src/lib/file.ts'),
      },
    };

    exportFile(options as unknown as ExportFileOptions);

    expect(options.from.getFilePath).toHaveBeenCalledTimes(1);
    expect(options.from.addExportDeclaration).toHaveBeenCalledWith({
      moduleSpecifier: './lib/file',
    });
  });

  it('should create folder export declaration', () => {
    const options = {
      from: {
        getFilePath: jest.fn().mockReturnValue('/src/index.ts'),
        addExportDeclaration: jest.fn(),
      },
      target: {
        getBaseName: jest.fn().mockReturnValue('index.ts'),
        getFilePath: jest.fn().mockReturnValue('/src/lib/index.ts'),
      },
    };

    exportFile(options as unknown as ExportFileOptions);

    expect(options.from.getFilePath).toHaveBeenCalledTimes(1);
    expect(options.from.addExportDeclaration).toHaveBeenCalledWith({
      moduleSpecifier: './lib',
    });
  });
});
