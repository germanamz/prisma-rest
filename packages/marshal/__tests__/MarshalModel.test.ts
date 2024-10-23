import { DMMF } from '@prisma/generator-helper';
import { MarshalModel } from '../src';

describe('MarshalModel', () => {
  it('should interpret the model and its fields', () => {
    const model = {
      name: 'Test',
      fields: [
        {
          name: 'id',
          type: 'String',
          kind: 'scalar',
          isId: true,
        },
        {
          name: 'name',
          type: 'String',
          kind: 'scalar',
          isId: false,
          isUnique: true,
        },
        {
          name: 'section',
          type: 'Int',
          kind: 'scalar',
          isId: false,
          isUnique: false,
        },
        {
          name: 'namespace',
          type: 'String',
          kind: 'scalar',
          isId: false,
          isUnique: false,
        },
      ],
      uniqueFields: [
        ['section', 'namespace'],
      ],
    } as unknown as DMMF.Model;
    const marshalModel = new MarshalModel(model);

    expect(marshalModel.name).toEqual('Test');
    expect(marshalModel.numberOfUniqueFields).toEqual(3);
    expect(marshalModel.idField?.name).toEqual('id');
    expect(marshalModel.singleUniqueFields[0].name).toEqual('name');
    expect(marshalModel.singleUniqueFields.length).toEqual(1);
    expect(marshalModel.uniqueFields[0].name).toEqual('section_namespace');
    expect(marshalModel.uniqueFields.length).toEqual(1);
  });
});
