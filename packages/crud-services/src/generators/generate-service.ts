import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import { createSourceFile, Registry } from '@germanamz/prisma-rest-toolbox';
import { generateCreateMethod } from './generate-create-method';
import { generateUpdateMethod } from './generate-update-method';
import { generateDeleteMethod } from './generate-delete-method';
import { generateFindMethod } from './generate-find-method';
import { generateFindUniqueMethod } from './generate-find-unique-method';

export type GenerateServiceOptions = {
  item: DMMF.Model;
  dir: string;
  project: Project;
  registry: Registry;
  clientPath: string;
};
export const generateService = (
  {
    project,
    item: model,
    dir,
    clientPath,
    registry,
  }: GenerateServiceOptions,
) => {
  const file = createSourceFile({
    dir,
    project,
    name: `${model.name.toLowerCase()}-crud-service.ts`,
  });

  file.addImportDeclaration({
    moduleSpecifier: clientPath,
    namedImports: ['PrismaClient', 'Prisma', model.name],
  });

  file.addImportDeclaration({
    moduleSpecifier: '@germanamz/errno',
    namedImports: ['Errno', 'translateToErrno'],
  });

  file.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });

  file.addImportDeclaration({
    moduleSpecifier: 'neverthrow',
    namedImports: ['Ok', 'Err', 'ok', 'err'],
  });

  const serviceClassName = `${model.name}CrudService`;
  const serviceClass = file.addClass({
    name: serviceClassName,
    isExported: true,
    ctors: [
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
    serviceClass,
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

  generateFindUniqueMethod({
    model,
    serviceClass,
  });

  registry.set(serviceClassName, file);

  return file;
};
