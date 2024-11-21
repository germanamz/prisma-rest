import { getMockDmmf } from 'test-lib';
import { MarshalField, MarshalModel } from '../src';

describe('MarshalModel', () => {
  it('should interpret the model and its fields', async () => {
    const dmmf = await getMockDmmf();
    const model = dmmf.datamodel.models[0];
    const marshalModel = new MarshalModel(model);

    expect(marshalModel.name).toEqual('Ledger');
    expect(marshalModel.idField).toBeInstanceOf(MarshalField);
    expect(marshalModel.idField!.name).toEqual('id');
    expect(marshalModel.numberOfUniqueFields).toEqual(1);
    expect(marshalModel.fields).toHaveLength(9); // Includes relation fields
    expect(marshalModel.scalarFields).toHaveLength(6);
    expect(marshalModel.enumFields).toHaveLength(2);
    expect(marshalModel.listFields).toHaveLength(2);
    expect(marshalModel.requiredFields).toHaveLength(7);
    expect(marshalModel.optionalFields).toHaveLength(1);
  });
});
