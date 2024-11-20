import { generatorHandler } from '@prisma/generator-helper';
import path from 'path';
import { makeGeneratorContext } from '@germanamz/prisma-rest-toolbox';
import { generateHono } from './generators/generate-hono';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './hono',
      prettyName: 'Hono APIs',
    };
  },
  async onGenerate(options) {
    const {
      schemaPath,
      generator: {
        output,
        config: {
          clientPath: rawClientPath,
        },
      },
      dmmf,
    } = options;
    const schemaDir = path.dirname(schemaPath);
    const dir = output?.value ? output.value : path.resolve(schemaDir, 'hono');
    const clientPath = rawClientPath
      ? path.resolve(path.dirname(schemaPath), Array.isArray(rawClientPath)
        ? rawClientPath[0]
        : rawClientPath)
      : '@prisma/client';
    const ctx = makeGeneratorContext({
      dir,
      dmmf,
    });

    generateHono({
      ...ctx,
      clientPath,
    });

    await ctx.project.save();
  },
});
