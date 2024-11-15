import { CodeBlockWriter, SourceFile, VariableDeclarationKind } from 'ts-morph';
import { declareConstant, DeclareConstantOptions } from '../src';

// TODO: Use real project
describe('declareConstant', () => {
  const mockOptions = (opts?: Partial<DeclareConstantOptions>): DeclareConstantOptions => {
    const writer = {} as CodeBlockWriter;
    const sourceFile = {
      addVariableStatement: jest.fn().mockImplementation((addOptions) => {
        if (typeof addOptions.declarations[0] === 'function') {
          addOptions.declarations[0](writer);
        }

        return {};
      }),
    } as unknown as SourceFile;

    return {
      name: 'MyConstant',
      sourceFile,
      registry: new Map(),
      isExported: true,
      initializer: jest.fn(),
      ...opts,
    };
  };

  it('should declare a constant', () => {
    const options = mockOptions();
    const statement = declareConstant(options);

    expect(statement).toEqual({});
    expect(options.sourceFile.addVariableStatement).toBeCalledWith({
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: options.name,
          initializer: expect.any(Function),
        },
      ],
      isExported: true,
    });
  });
});
