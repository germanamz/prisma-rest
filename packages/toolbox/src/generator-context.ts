import { Project } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { MarshalDocument } from '@germanamz/prisma-rest-marshal';
import { ImportQueue } from './import-queue';
import { Registry } from './registry';

// TODO: Remove deprecated dmmf
export type GeneratorContext = {
  dir: string;
  project: Project;
  // @deprecated use marshalDocument instead, present for backwards compatibility
  dmmf: DMMF.Document;
  importQueue: ImportQueue;
  registry: Registry;
  marshalDocument: MarshalDocument;
};

export type MakeGeneratorContextOptions = Partial<Omit<GeneratorContext, 'dmmf'>> & Pick<GeneratorContext, 'dmmf'> & {
  tsConfigFilePath?: string;
};

export const makeGeneratorContext = (options: MakeGeneratorContextOptions): GeneratorContext => ({
  dir: options.dir ?? process.cwd(),
  project: options.project ?? new Project({
    ...(options.tsConfigFilePath ? { tsConfigFilePath: options.tsConfigFilePath } : {}),
    skipAddingFilesFromTsConfig: true,
  }),
  importQueue: options.importQueue ?? new Map() as ImportQueue,
  registry: options.registry ?? new Map() as Registry,
  marshalDocument: options.marshalDocument ?? new MarshalDocument(options.dmmf),
  dmmf: options.dmmf,
});
