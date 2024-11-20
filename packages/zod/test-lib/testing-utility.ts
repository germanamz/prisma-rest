import { GeneratorContext, makeGeneratorContext } from '@germanamz/prisma-rest-toolbox';
import { getDMMF } from '@prisma/internals';
import { resolve } from 'node:path';
import { DMMF } from '@prisma/generator-helper';
import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

export const loadTestSchema = async (): Promise<{ dmmf: DMMF.Document; ctx: GeneratorContext }> => {
  const dmmf = await getDMMF({
    datamodelPath: resolve(__dirname, '../prisma/schema.prisma'),
  });
  const ctx = makeGeneratorContext({
    dmmf,
    dir: '/generated',
    project: new Project({
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
    }),
  });

  return {
    dmmf,
    ctx,
  };
};
