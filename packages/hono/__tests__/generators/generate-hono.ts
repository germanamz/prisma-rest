import { makeGeneratorContext } from '@germanamz/prisma-rest-toolbox';
import { assertProjectSnapshot, loadBasicMocks } from 'test-lib';
import { SourceFile } from 'ts-morph';
import { generateHono } from '../../src/generators/generate-hono';

describe('generateHono', () => {
  it('should generate hono', async () => {
    const basicMocks = await loadBasicMocks();
    const ctx = makeGeneratorContext(basicMocks);
    const file = generateHono({
      ...ctx,
      clientPath: '@prisma/client',
    });

    expect(file).toBeInstanceOf(SourceFile);
    assertProjectSnapshot(ctx.project);
  });
});
