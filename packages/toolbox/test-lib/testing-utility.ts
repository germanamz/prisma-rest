import { getDMMF } from '@prisma/internals';
import { resolve } from 'node:path';
import { DMMF } from '@prisma/generator-helper';
import { GeneratorContext, makeGeneratorContext } from '../src';

export const loadTestSchema = async (): Promise<{ dmmf: DMMF.Document; ctx: GeneratorContext }> => {
  const dmmf = await getDMMF({
    datamodelPath: resolve(__dirname, '../prisma/schema.prisma'),
  });
  const ctx = makeGeneratorContext({
    dmmf,
    tsConfigFilePath: resolve(__dirname, '../tsconfig.json'),
  });

  return {
    dmmf,
    ctx,
  };
};
