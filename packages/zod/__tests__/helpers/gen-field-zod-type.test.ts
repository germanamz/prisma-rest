import { DMMF } from '@prisma/generator-helper';
import { SourceFile } from 'ts-morph';
import { genFieldZodType, GenFieldZodTypeOptions } from '../../src/helpers/gen-field-zod-type';

const addToImportQueueMock = jest.fn();

jest.mock('@germanamz/prisma-rest-toolbox', () => ({
  __esModule: true,
  addToImportQueue: (...args: any) => addToImportQueueMock(...args),
}));

describe('genFieldZodType', () => {
  const mockOptions = (opts: Pick<GenFieldZodTypeOptions, 'field'> & Partial<Omit<GenFieldZodTypeOptions, 'field'>>) => ({
    sourceFile: {} as SourceFile,
    isOptional: false,
    importQueue: new Map(),
    ...opts,
    field: opts.field as DMMF.Field,
  });

  it('should generate a required scalar', () => {
    const field = {
      type: 'String',
      isRequired: true,
      kind: 'scalar',
    } as DMMF.Field;
    const result = genFieldZodType(mockOptions({ field }));

    expect(result).toEqual('z.string()');
    expect(addToImportQueueMock).not.toHaveBeenCalled();
  });

  it('should generate a nullish enum', () => {
    const field = {
      type: 'Enum',
      isRequired: false,
      kind: 'enum',
    } as DMMF.Field;
    const options = mockOptions({ field });
    const result = genFieldZodType(options);

    expect(result).toEqual(`${field.type}.nullish()`);
    expect(addToImportQueueMock).toHaveBeenCalledWith(
      options.importQueue,
      options.sourceFile,
      [field.type],
    );
  });

  it('should generate a required but optional enum', () => {
    const field = {
      type: 'Enum',
      isRequired: true,
      kind: 'enum',
    } as DMMF.Field;
    const options = mockOptions({ field, isOptional: true });
    const result = genFieldZodType(options);

    expect(result).toEqual(`${field.type}.optional()`);
    expect(addToImportQueueMock).toHaveBeenCalledWith(
      options.importQueue,
      options.sourceFile,
      [field.type],
    );
  });
});
