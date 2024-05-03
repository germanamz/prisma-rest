import { DMMF } from '@prisma/generator-helper';
import { Project, SourceFile } from 'ts-morph';
import { generateCreateMethod } from './generate-create-method';
import { generateUpdateMethod } from './generate-update-method';
import { generateDeleteMethod } from './generate-delete-method';
import { generateFindMethod } from './generate-find-method';
import { generateFindByIdMethod } from './generate-find-by-id-method';
import path from 'path';
import { Registry } from '@germanamz/prisma-rest-toolbox';

export type GenerateServiceOptions = {
  item: DMMF.Model;
  dir: string;
  project: Project;
  registry: Registry;
  clientPath?: string;
};
export const generateService = ({ project, item: model, dir, clientPath, registry }: GenerateServiceOptions) => {
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

  const serviceClassName = `${model.name}CrudService`;
  const serviceClass = file.addClass({
    name: serviceClassName,
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

  registry.set(serviceClassName, file);

  return file;
};
