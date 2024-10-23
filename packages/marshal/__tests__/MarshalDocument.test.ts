import { DMMF } from '@prisma/generator-helper';
import { MarshalDocument, MarshalModel } from '../src';
import { MarshalEnum } from '../src/MarshalEnum';

describe('MarshalDocument', () => {
  it('should interpret a document', () => {
    const dmmfDoc = {
      datamodel: {
        models: [
          {
            name: 'User',
            uniqueFields: [],
            fields: [
              {
                name: 'id',
                kind: 'scalar',
                type: 'Int',
                isRequired: false,
                isList: false,
                isUnique: false,
                isId: true,
              },
            ],
          },
        ],
        enums: [
          {
            name: 'Role',
            values: [
              {
                name: 'ADMIN',
              },
              {
                name: 'USER',
              },
            ],
          },
        ],
      },
    } as unknown as DMMF.Document;
    const marshalDoc = new MarshalDocument(dmmfDoc);

    expect(marshalDoc.models).toHaveLength(1);
    expect(marshalDoc.models[0]).toBeInstanceOf(MarshalModel);
    expect(marshalDoc.enums).toHaveLength(1);
    expect(marshalDoc.enums[0]).toBeInstanceOf(MarshalEnum);
  });
});
