import { DMMF } from '@prisma/generator-helper';
import { MarshalField } from './MarshalField';
import { MarshalUniqueField } from './MarshalUniqueField';

export class MarshalModel {
  model: DMMF.Model;

  name: string;

  idField?: MarshalField | null;

  singleUniqueFields: MarshalField[] = [];

  uniqueFields: MarshalUniqueField[] = [];

  fields: MarshalField[] = [];

  numberOfUniqueFields: number = 0;

  constructor(model: DMMF.Model) {
    this.model = model;
    this.name = model.name;
    this.idField = null;

    this.buildFields();
    this.buildUniqueFields();
  }

  buildFields = () => {
    for (const dmmfField of this.model.fields) {
      const marshalField = new MarshalField(dmmfField);

      // Add to general fields
      this.fields.push(marshalField);

      // Set id field
      if (marshalField.isId) {
        this.idField = marshalField;
        this.numberOfUniqueFields += 1;
      }

      // Set single unique fields
      if (marshalField.isUnique) {
        this.singleUniqueFields.push(marshalField);
        this.numberOfUniqueFields += 1;
      }
    }
  };

  buildUniqueFields = () => {
    for (const unique of this.model.uniqueFields) {
      const marshalUniqueField = new MarshalUniqueField(
        this.fields.filter(
          (field) => unique.includes(field.name),
        ),
      );

      this.uniqueFields.push(marshalUniqueField);
      this.numberOfUniqueFields += 1;
    }
  };
}
