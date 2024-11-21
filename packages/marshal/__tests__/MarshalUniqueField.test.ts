import { getMockDmmf } from 'test-lib';
import { MarshalField, MarshalModel } from '../src';

describe('MarshalUniqueField', () => {
  it('should create interpret fields', async () => {
    const dmmf = await getMockDmmf();
    const uniqueFields = MarshalModel.buildUniqueFields(
      dmmf.datamodel.models[1].uniqueFields,
      dmmf.datamodel.models[1].fields.map(
        (f) => new MarshalField(f),
      ),
    );

    expect(uniqueFields).toHaveLength(2);
    expect(uniqueFields[0].name).toEqual('namespace_section');
    expect(uniqueFields[1].name).toEqual('section_label');
  });
});
