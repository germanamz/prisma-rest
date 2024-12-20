import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import { getMockDmmf } from './get-mock-dmmf';
import { makeMockProject } from './make-mock-project';
import { getSchemaPath } from './get-schema-path';
import { getMockDir } from './get-mock-dir';

export type BasicMocks = {
  dmmf: DMMF.Document; // Loaded using getMockDmmf()
  project: Project; // Loaded using makeMockProject()
  schemaPath: string; // Loaded using getSchemaPath()
  dir: string; // Loaded using getMockDir()
};

/**
 * Load basic mocks for testing.
 *
 * @returns Promise<BasicMocks>
 */
export const loadBasicMocks = async (): Promise<BasicMocks> => ({
  dmmf: await getMockDmmf(),
  project: makeMockProject(),
  schemaPath: getSchemaPath(),
  dir: getMockDir(),
});
