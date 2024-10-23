import { DMMF } from '@prisma/generator-helper';
import { prismaToZodScalar } from './lib/prismaToZodScalar';

export class MarshalField {
  field: DMMF.Field;

  name: string;

  type: string;

  isScalar: boolean;

  isEnum: boolean;

  isObject: boolean;

  isId: boolean;

  isUnique: boolean;

  isList: boolean;

  isRequired: boolean;

  zodType: string;

  constructor(field: DMMF.Field) {
    this.field = field;
    this.name = field.name;
    this.isId = field.isId;
    this.isUnique = field.isUnique;
    this.type = field.type;
    this.isList = field.isList;
    this.isRequired = field.isRequired;
    this.isScalar = field.kind === 'scalar';
    this.isEnum = field.kind === 'enum';
    this.isObject = field.kind === 'object';
    this.zodType = prismaToZodScalar(field.type);
  }
}
