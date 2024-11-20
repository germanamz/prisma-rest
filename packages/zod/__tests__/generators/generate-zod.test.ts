import { SourceFile } from 'ts-morph';
import { assertProjectSnapshot, loadBasicMocks } from 'test-lib';
import { makeGeneratorContext } from '@germanamz/prisma-rest-toolbox';
import { generateZod } from '../../src';

describe('generateZod', () => {
  it('should generate the datamodel, crud schemas and execute the import queue', async () => {
    const basicMocks = await loadBasicMocks();
    const ctx = makeGeneratorContext(basicMocks);
    const indexFile = generateZod(ctx);

    expect(indexFile).toBeInstanceOf(SourceFile);

    assertProjectSnapshot(ctx.project);
  });
});
