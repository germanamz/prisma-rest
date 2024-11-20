import { getMockDmmf } from './get-mock-dmmf';
import { makeMockProject } from './make-mock-project';
import { getSchemaPath } from './get-schema-path';

export const loadBasicMocks = async () => ({
  dmmf: await getMockDmmf(),
  project: makeMockProject(),
  schemaPath: getSchemaPath(),
});
