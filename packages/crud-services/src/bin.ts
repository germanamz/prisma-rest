#! /usr/bin/env node
import { generatorHandler } from '@prisma/generator-helper';
import path from 'path';
import { makeGeneratorContext } from '@germanamz/prisma-rest-toolbox';
import { generateCrudServices } from './generators/generate-crud-services';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './services',
      prettyName: 'CRUD Services',
    };
  },
  async onGenerate(options) {
    const {
      dmmf,
      generator: {
        output,
        config: {
          clientPath: rawClientPath,
        },
      },
      schemaPath,
    } = options;
    const schemaDir = path.dirname(schemaPath);
    const dir = output?.value ? output.value : path.resolve(schemaDir, 'services');
    const clientPath = rawClientPath
      ? path.resolve(schemaDir, Array.isArray(rawClientPath)
        ? rawClientPath[0]
        : rawClientPath)
      : '@prisma/client';
    const ctx = makeGeneratorContext({
      dir,
      dmmf,
    });

    generateCrudServices({
      ...ctx,
      clientPath,
    });

    await ctx.project.save();
  },
});
