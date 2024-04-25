import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import { generateCreateMethod } from './generate-create-method';
import { generateUpdateMethod } from './generate-update-method';
import { generateDeleteMethod } from './generate-delete-method';
import { generateFindMethod } from './generate-find-method';
import { generateFindByIdMethod } from './generate-find-by-id-method';
import path from 'path';

export type GenerateServiceOptions = {
  model: DMMF.Model;
  dir: string;
  project: Project;
  clientPath?: string;
};
export const generateService = ({ project, model, dir, clientPath }: GenerateServiceOptions) => {
  const filePath = `${dir}/${model.name.toLowerCase()}-crud-service.ts`;
  const file = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  file.addImportDeclaration({
    moduleSpecifier: clientPath ? path.relative(path.dirname(filePath), clientPath) : '@prisma/client',
    namedImports: ['PrismaClient', 'Prisma', model.name],
  });

  file.addImportDeclaration({
    moduleSpecifier: '@germanamz/errno',
    namedImports: ['Errno', 'translateToErrno'],
  });

  file.addImportDeclaration({
    moduleSpecifier: 'neverthrow',
    namedImports: ['Ok', 'Err', 'ok', 'err'],
  });

  const serviceClass = file.addClass({
    name: `${model.name}CrudService`,
    isExported: true,
    ctors:[
      {
        parameters: [
          {
            name: 'private prisma',
            type: 'PrismaClient',
          },
        ],
      },
    ],
  });

  generateCreateMethod({
    model,
    serviceClass
  });

  generateUpdateMethod({
    model,
    serviceClass,
  });

  generateDeleteMethod({
    model,
    serviceClass,
  });

  generateFindMethod({
    model,
    serviceClass,
  });

  generateFindByIdMethod({
    model,
    serviceClass,
  });

  return file;
};
