import { SourceFile } from 'ts-morph';
import { addToImportQueue, executeImportQueue, ImportQueue } from '../src';

describe('import-queue', () => {
  describe('addToImportQueue', () => {
    it('should add to the queue correctly', () => {
      const q: ImportQueue = new Map();
      const sourceFile = {} as SourceFile;

      addToImportQueue(q, sourceFile, ['test']);
      addToImportQueue(q, sourceFile, ['test2']);

      expect(q.has(sourceFile)).toBeTruthy();
      expect(q.size).toBe(1);
      expect(q.get(sourceFile)).toEqual(new Set(['test', 'test2']));
    });
  });

  describe('executeImportQueue', () => {
    it('should import all', () => {
      const fromSourceFile = {
        getDirectoryPath: jest.fn().mockReturnValue('/from'),
        addImportDeclaration: jest.fn(),
      } as unknown as SourceFile;
      const aSourceFile = {
        getBaseNameWithoutExtension: jest.fn().mockReturnValue('a-file'),
        getDirectoryPath: jest.fn().mockReturnValue('/from'),
      } as unknown as SourceFile;
      const bSourceFile = {
        getBaseNameWithoutExtension: jest.fn().mockReturnValue('b-file'),
        getDirectoryPath: jest.fn().mockReturnValue('/path/b'),
      } as unknown as SourceFile;
      const q: ImportQueue = new Map([
        [fromSourceFile, new Set(['a', 'b'])],
      ]);
      const registry = new Map([
        ['a', aSourceFile],
        ['b', bSourceFile],
      ]);

      executeImportQueue(q, registry);

      expect(fromSourceFile.addImportDeclaration).toHaveBeenNthCalledWith(
        1,
        {
          moduleSpecifier: './a-file',
          namedImports: ['a'],
        },
      );

      expect(fromSourceFile.addImportDeclaration).toHaveBeenNthCalledWith(
        2,
        {
          moduleSpecifier: '../path/b',
          namedImports: ['b'],
        },
      );
    });

    it('should log identifier not found', () => {
      const fromSourceFile = {
        getDirectoryPath: jest.fn().mockReturnValue('/from'),
        addImportDeclaration: jest.fn(),
      } as unknown as SourceFile;
      const aSourceFile = {
        getBaseNameWithoutExtension: jest.fn().mockReturnValue('a-file'),
        getDirectoryPath: jest.fn().mockReturnValue('/from'),
      } as unknown as SourceFile;
      const q: ImportQueue = new Map([
        [fromSourceFile, new Set(['a', 'b'])],
      ]);
      const registry = new Map([
        ['a', aSourceFile],
      ]);
      const logMock = jest.fn();

      jest.spyOn(console, 'log').mockImplementation(logMock);

      expect(() => executeImportQueue(q, registry)).toThrow();
      expect(logMock).toHaveBeenNthCalledWith(1, 'Failed to execute import queue');
      expect(logMock).toHaveBeenNthCalledWith(2, new Error('Failed to import b'));
      expect(fromSourceFile.addImportDeclaration).toHaveBeenNthCalledWith(
        1,
        {
          moduleSpecifier: './a-file',
          namedImports: ['a'],
        },
      );
    });
  });
});
