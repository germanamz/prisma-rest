import {
  Project,
} from 'ts-morph';
import { createSourceFile, CreateSourceFileOptions } from '../src';

// TODO: Use real project
describe('createSourceFile', () => {
  const mockOptions = (opts?: Partial<CreateSourceFileOptions>): CreateSourceFileOptions => ({
    project: {
      createSourceFile: jest.fn().mockReturnValue({}),
    } as unknown as Project,
    name: 'SnakeTest',
    dir: 'src',
    ...opts,
  });

  it('should create a source file with ext', () => {
    const options = mockOptions({ ext: '.js' });
    const sourceFile = createSourceFile(options);

    expect(sourceFile).toEqual({});
    expect(options.project.createSourceFile).toHaveBeenCalledWith('src/snake-test.js', undefined, { overwrite: true });
  });

  it('should create a source file without ext', () => {
    const options = mockOptions();
    const sourceFile = createSourceFile(options);

    expect(sourceFile).toEqual({});
    expect(options.project.createSourceFile).toHaveBeenCalledWith('src/snake-test.ts', undefined, { overwrite: true });
  });
});
