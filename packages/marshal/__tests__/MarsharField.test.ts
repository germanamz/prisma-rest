import { DMMF } from '@prisma/generator-helper';
import { MarshalField } from '../src';

describe('MarshalField', () => {
  it('should interpret a field', () => {
    const field = {
      type: 'String',
      name: 'name',
      isList: false,
      isRequired: false,
      isUnique: false,
      kind: 'scalar',
      isId: false,
    } as DMMF.Field;
    const marshalField = new MarshalField(field);

    expect(marshalField.name).toEqual('name');
    expect(marshalField.isId).toEqual(false);
    expect(marshalField.isRequired).toEqual(false);
    expect(marshalField.isUnique).toEqual(false);
    expect(marshalField.isList).toEqual(false);
    expect(marshalField.type).toEqual('String');
    expect(marshalField.zodType).toEqual('string');
  });
});
