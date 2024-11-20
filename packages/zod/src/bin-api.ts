import { GeneratorOptions } from '@prisma/generator-helper';
import path from 'path';
import { makeGeneratorContext } from '@germanamz/prisma-rest-toolbox';
import { generateZod } from './generators/generate-zod';

export function onManifest() {
  return {
    defaultOutput: './zod',
    prettyName: 'Zod schemas',
  };
}

export async function onGenerate(options: GeneratorOptions) {
  const {
    schemaPath,
    generator: {
      output,
    },
    dmmf,
  } = options;
  const schemaDir = path.dirname(schemaPath);
  const dir = output?.value ? output.value : path.resolve(schemaDir, 'zod');
  const ctx = makeGeneratorContext({ dir, dmmf });

  generateZod(ctx);

  await ctx.project.save();
}
