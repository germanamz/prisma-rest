import { generatorHandler } from '@prisma/generator-helper';
import path from 'path';
import { Project, SourceFile } from 'ts-morph';
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
    const project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
    const registry = new Map<string, SourceFile>();

    generateHono({
      project,
      dir,
      dmmf,
      registry,
      clientPath,
    });

    await project.save();
  },
});
