import { Project } from 'ts-morph';
import { normalizeFilename } from './normalize-filename';

export type CreateSourceFileOptions = {
  project: Project;
  name: string;
  dir: string;
  ext?: string;
  content?: string;
};

export const createSourceFile = (options: CreateSourceFileOptions) => {
  const {
    dir,
    project,
    name,
    ext = '.ts',
    content,
  } = options;

  return project.createSourceFile(
    `${dir}/${normalizeFilename(name)}${ext}`,
    content,
    { overwrite: true },
  );
};
