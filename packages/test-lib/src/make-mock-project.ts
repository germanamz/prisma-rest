import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

/**
 * Creates a mock project with in-memory file system.
 *
 * @returns Project
 */
export const makeMockProject = () => new Project({
  skipAddingFilesFromTsConfig: true,
  useInMemoryFileSystem: true,
  compilerOptions: {
    target: ScriptTarget.ES2021,
    module: ModuleKind.CommonJS,
    declaration: true,
    esModuleInterop: true,
    strict: true,
    noEmitHelpers: true,
    importHelpers: true,
    sourceMap: true,
    skipLibCheck: true,
  },
});
