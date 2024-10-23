import { DMMF } from '@prisma/generator-helper';
import { MarshalEnum } from '../src/MarshalEnum';

describe('MarshalField', () => {
  it('should interpret a field', () => {
    const enumType = {
      name: 'name',
      values: [
        {
          name: 'value1',
          dbName: 'value1',
        },
        {
          name: 'value2',
          dbName: 'value2',
        },
      ],
    } as DMMF.DatamodelEnum;
    const marshalField = new MarshalEnum(enumType);

    expect(marshalField.name).toEqual('name');
    expect(marshalField.values).toEqual(['value1', 'value2']);
  });
});
