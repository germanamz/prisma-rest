import { Project, SourceFile } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { generateInput } from './generate-input';
import { generateNamespace } from '../helpers/generate-namespace';
import path from 'path';

export type GenerateInputsOptions = {
  project: Project;
  dir: string;
  inputs: DMMF.Document['schema']['inputObjectTypes'];
  registry: Map<string, SourceFile>;
  importQueue: Map<SourceFile, Set<string>>;
};

export const generateInputs = ({ project, dir, inputs, registry, importQueue }: GenerateInputsOptions) => {
  return generateNamespace({
    project,
    dir,
    items: inputs.prisma,
    registry,
    importQueue,
    handler: generateInput,
  });
};
