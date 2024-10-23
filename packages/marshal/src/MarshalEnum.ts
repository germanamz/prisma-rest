import { DMMF } from '@prisma/generator-helper';

export class MarshalEnum {
  enum: DMMF.DatamodelEnum;

  name: string;

  values: string[] = [];

  constructor(enumType: DMMF.DatamodelEnum) {
    this.enum = enumType;
    this.name = enumType.name;
    this.values = enumType.values.map((value) => value.name);
  }
}
