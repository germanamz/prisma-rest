import { getMockDmmf } from 'test-lib';
import { MarshalEnum } from '../src';

describe('MarshalField', () => {
  it('should interpret a field', async () => {
    const dmmf = await getMockDmmf();
    const enumType = dmmf.datamodel.enums[0];
    const marshalField = new MarshalEnum(enumType);

    expect(marshalField.name).toEqual('LedgerType');
    expect(marshalField.values).toEqual(['MAIN', 'CC']);
  });
});
