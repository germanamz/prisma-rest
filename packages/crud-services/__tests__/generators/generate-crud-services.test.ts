import { makeGeneratorContext } from '@germanamz/prisma-rest-toolbox';
import { assertProjectSnapshot, loadBasicMocks } from 'test-lib';
import { SourceFile } from 'ts-morph';
import { generateCrudServices } from '../../src';

describe('generateCrudServices', () => {
  it('should generate crud services', async () => {
    const basicMocks = await loadBasicMocks();
    const ctx = makeGeneratorContext(basicMocks);

    const file = generateCrudServices({
      ...ctx,
      clientPath: '@prisma/client',
    });

    expect(file).toBeInstanceOf(SourceFile);
    assertProjectSnapshot(ctx.project);
  });
});
