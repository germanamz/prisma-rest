import { DMMF } from '@prisma/generator-helper';
import { MarshalModel } from './MarshalModel';
import { MarshalEnum } from './MarshalEnum';

export class MarshalDocument {
  dmmf: DMMF.Document;

  models: MarshalModel[];

  enums: MarshalEnum[];

  constructor(dmmf: DMMF.Document) {
    this.dmmf = dmmf;

    this.models = dmmf.datamodel.models.map((model) => new MarshalModel(model));
    this.enums = dmmf.datamodel.enums.map((enumType) => new MarshalEnum(enumType));
  }
}
