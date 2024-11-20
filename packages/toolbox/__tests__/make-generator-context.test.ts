import { getDMMF } from '@prisma/internals';
import { resolve } from 'node:path';
import { Project } from 'ts-morph';
import { MarshalDocument } from '@germanamz/prisma-rest-marshal';
import { makeGeneratorContext } from '../src';

describe('makeGeneratorContext', () => {
  it('should create a generator context with tsConfigFilePath', async () => {
    const dmmf = await getDMMF({
      datamodelPath: resolve(__dirname, '../prisma/schema.prisma'),
    });
    const ctx = makeGeneratorContext({
      dmmf,
      tsConfigFilePath: resolve(__dirname, '../tsconfig.json'),
    });

    expect(ctx.dmmf).toBe(dmmf);
    expect(ctx.project).toBeInstanceOf(Project);
    expect(ctx.dir).toMatch(new RegExp(`^${resolve(__dirname, '../../..')}.*`));
    expect(ctx.marshalDocument).toBeInstanceOf(MarshalDocument);
    expect(ctx.registry).toBeInstanceOf(Map);
    expect(ctx.importQueue).toBeInstanceOf(Map);
  });
  it('should create a generator context without tsConfigFilePath', async () => {
    const dmmf = await getDMMF({
      datamodelPath: resolve(__dirname, '../prisma/schema.prisma'),
    });
    const ctx = makeGeneratorContext({
      dmmf,
    });

    expect(ctx.dmmf).toBe(dmmf);
    expect(ctx.project).toBeInstanceOf(Project);
    expect(ctx.dir).toMatch(new RegExp(`^${resolve(__dirname, '../../..')}.*`));
    expect(ctx.marshalDocument).toBeInstanceOf(MarshalDocument);
    expect(ctx.registry).toBeInstanceOf(Map);
    expect(ctx.importQueue).toBeInstanceOf(Map);
  });
});
