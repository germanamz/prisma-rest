import { getMockDmmf } from 'test-lib';
import { MarshalDocument, MarshalModel, MarshalEnum } from '../src';

describe('MarshalDocument', () => {
  it('should interpret a document', async () => {
    const dmmf = await getMockDmmf();
    const marshalDoc = new MarshalDocument(dmmf);

    expect(marshalDoc.dmmf).toBe(dmmf);
    expect(marshalDoc.models).toHaveLength(6);

    for (const model of marshalDoc.models) {
      expect(model).toBeInstanceOf(MarshalModel);
    }

    // TODO: Add support for mongo schemas, for now we only support postgres
    // expect(marshalDoc.types).toHaveLength(0);

    expect(marshalDoc.enums).toHaveLength(3);

    for (const model of marshalDoc.enums) {
      expect(model).toBeInstanceOf(MarshalEnum);
    }
  });
});
