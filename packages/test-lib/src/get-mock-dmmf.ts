import { getDMMF } from '@prisma/internals';
import { getSchemaPath } from './get-schema-path';

/**
 * Loads DMMF from common schema.
 *
 * @returns DMMF.Document
 */
export const getMockDmmf = async () => getDMMF({
  datamodelPath: getSchemaPath(),
});
