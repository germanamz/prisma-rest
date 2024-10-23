import { MarshalField } from './MarshalField';

export class MarshalUniqueField {
  fields: MarshalField[];

  name: string;

  constructor(fields: MarshalField[]) {
    this.name = fields.map((field) => field.name).join('_');
    this.fields = fields;
  }
}
