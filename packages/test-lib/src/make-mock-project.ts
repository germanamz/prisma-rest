import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

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
