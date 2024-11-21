import { DMMF } from '@prisma/generator-helper';
import { MarshalField } from './MarshalField';
import { MarshalUniqueField } from './MarshalUniqueField';

export class MarshalModel {
  model: DMMF.Model;

  name: string;

  fields: MarshalField[] = [];

  scalarFields: MarshalField[] = [];

  enumFields: MarshalField[] = [];

  simpleFields: MarshalField[] = [];

  requiredFields: MarshalField[] = [];

  optionalFields: MarshalField[] = [];

  listFields: MarshalField[] = [];

  relationFields: MarshalField[] = [];

  idField?: MarshalField | null;

  singleUniqueFields: MarshalField[] = [];

  uniqueFields: MarshalUniqueField[] = [];

  numberOfUniqueFields: number = 0;

  constructor(model: DMMF.Model) {
    this.model = model;
    this.name = model.name;
    this.idField = null;

    this.buildFields();
    this.uniqueFields = MarshalModel.buildUniqueFields(this.model.uniqueFields, this.fields);
  }

  buildFields = () => {
    for (const dmmfField of this.model.fields) {
      const marshalField = new MarshalField(dmmfField);

      // Add to general fields
      this.fields.push(marshalField);

      if (marshalField.isRelation) {
        this.relationFields.push(marshalField);
        // Relation fields should not be added to other field lists
        // eslint-disable-next-line no-continue
        continue;
      }

      if (marshalField.isList) {
        this.listFields.push(marshalField);
      }

      if (marshalField.isEnum) {
        this.enumFields.push(marshalField);
      }

      if (marshalField.isScalar) {
        this.scalarFields.push(marshalField);
      }

      if (marshalField.isEnum || marshalField.isScalar) {
        this.simpleFields.push(marshalField);
      }

      if (marshalField.isRequired) {
        this.requiredFields.push(marshalField);
      } else {
        this.optionalFields.push(marshalField);
      }

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

  static buildUniqueFields = (
    uniqueFields: readonly (readonly string[])[],
    fields: MarshalField[],
  ) => {
    const marshalUniqueFields: MarshalUniqueField[] = [];

    for (const unique of uniqueFields) {
      const marshalUniqueField = new MarshalUniqueField(
        fields.filter(
          (field) => unique.includes(field.name),
        ),
      );

      marshalUniqueFields.push(marshalUniqueField);
    }

    return marshalUniqueFields;
  };
}
