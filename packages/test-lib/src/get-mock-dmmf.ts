import { getDMMF } from '@prisma/internals';
import { getSchemaPath } from './get-schema-path';

export const getMockDmmf = async () => getDMMF({
  datamodelPath: getSchemaPath(),
});
