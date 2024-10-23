import { DMMF } from '@prisma/generator-helper';
import { MarshalField, MarshalUniqueField } from '../src';

describe('MarshalUniqueField', () => {
  it('should create interpret fields', () => {
    const dmmfFields = [
      {
        name: 'id',
      },
      {
        name: 'name',
      },
    ] as DMMF.Field[];
    const marshalFields = dmmfFields.map((f) => new MarshalField(f));
    const uniqueField = new MarshalUniqueField(marshalFields);

    expect(uniqueField.fields).toEqual(marshalFields);
    expect(uniqueField.name).toEqual('id_name');
  });
});
