import { generatorHandler } from '@prisma/generator-helper';
import path from 'path';
import { Project, SourceFile } from 'ts-morph';
import { MarshalDocument } from '@germanamz/prisma-rest-marshal';
import { generateZod } from './generators/generate-zod';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './zod',
      prettyName: 'Zod schemas',
    };
  },
  async onGenerate(options) {
    const {
      schemaPath,
      generator: {
        output,
      },
      dmmf,
    } = options;
    const schemaDir = path.dirname(schemaPath);
    const dir = output?.value ? output.value : path.resolve(schemaDir, 'zod');
    const project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
    const registry = new Map<string, SourceFile>();
    const marshalDocument = new MarshalDocument(dmmf);

    generateZod({
      project,
      dir,
      dmmf,
      registry,
      marshalDocument,
    });

    await project.save();
  },
});
