import { getMockDmmf } from 'test-lib';
import { MarshalField } from '../src';

describe('MarshalField', () => {
  it('should interpret a field', async () => {
    const dmmf = await getMockDmmf();
    const field = dmmf.datamodel.models[0].fields[0];
    const marshalField = new MarshalField(field);

    expect(marshalField.name).toEqual('id');
    expect(marshalField.isId).toEqual(true);
    expect(marshalField.isRequired).toEqual(true);
    expect(marshalField.isUnique).toEqual(false);
    expect(marshalField.isList).toEqual(false);
    expect(marshalField.type).toEqual('String');
    expect(marshalField.isRelation).toEqual(false);
    expect(marshalField.isUpdatedAt).toEqual(false);
    expect(marshalField.hasDefault).toEqual(true);
    expect(marshalField.zodType).toEqual('string');
  });
});
