import { SourceFile } from 'ts-morph';
import { assertProjectSnapshot } from '@germanamz/prisma-rest-toolbox';
import { generateZod } from '../../src';
import { loadTestSchema } from '../../test-lib/testing-utility';

describe('generateZod', () => {
  it('should generate the datamodel, crud schemas and execute the import queue', async () => {
    const { ctx } = await loadTestSchema();
    const indexFile = generateZod(ctx);

    expect(indexFile).toBeInstanceOf(SourceFile);

    assertProjectSnapshot(ctx.project);
  });
});