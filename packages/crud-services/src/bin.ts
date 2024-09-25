#! /usr/bin/env node
import { generatorHandler } from '@prisma/generator-helper';
import path from 'path';
import { generateCrudServices } from './generators/generate-crud-services';
import { Project, SourceFile } from 'ts-morph';

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
    const project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
    const dir = output?.value || path.resolve(process.cwd(), 'services');
    const clientPath = rawClientPath ?
      path.resolve(path.dirname(schemaPath), Array.isArray(rawClientPath) ? rawClientPath[0] : rawClientPath)
      : undefined;
    const registry = new Map<string, SourceFile>();

    generateCrudServices({
      models: dmmf.datamodel.models,
      project,
      dir,
      clientPath,
      registry,
      dmmf,
    });

    await project.save();
  },
});
