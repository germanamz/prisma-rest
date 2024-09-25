import { Project, VariableDeclarationKind } from 'ts-morph';
import { addToImportQueue, declareConstant, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';
import { DMMF } from '@prisma/generator-helper';
import { apiHandlerWriter } from './writers/api-handler-writer';

export type GenerateApiOptions = {
  project: Project;
  registry: Registry;
  dir: string;
  item: DMMF.Model;
  importQueue: ImportQueue;
};

export const generateApi = ({ project, item, dir, registry, importQueue }: GenerateApiOptions) => {
  const file = project.createSourceFile(`${dir}/${item.name.toLowerCase()}-api.ts`, undefined, { overwrite: true });
  const apiName = `make${item.name}Api`;
  const serviceName = `${item.name}CrudService`;
  const createInputIdentifier = `${item.name}CreateInput`;
  const updateInputIdentifier = `${item.name}UpdateInput`;
  const listFilterIdentifier = `${item.name}ListFilter`;
  const uniqueFilterIdentifier = `${item.name}UniqueFilter`;
  const uniqueFilterWhereIdentifier = `${item.name}UniqueFilterWhere`;
  const identifiersToImport = [
    createInputIdentifier,
    updateInputIdentifier,
    serviceName,
    listFilterIdentifier,
    uniqueFilterIdentifier,
    uniqueFilterWhereIdentifier,
  ];

  file.addImportDeclaration({
    moduleSpecifier: 'hono',
    namedImports: ['Hono'],
  });
  file.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z'],
  });
  file.addImportDeclaration({
    moduleSpecifier: 'hono/utils/http-status',
    namedImports: ['StatusCode'],
  });
  file.addImportDeclaration({
    moduleSpecifier: '@hono/zod-validator',
    namedImports: ['zValidator'],
  });

  addToImportQueue(importQueue, file, identifiersToImport);

  declareConstant({
    name: apiName,
    registry,
    isExported: true,
    sourceFile: file,
    initializer: (writer) => {
      writer.write(`(service: ${serviceName}) => `);

      writer.block(() => {
        writer.writeLine('const app = new Hono();');

        apiHandlerWriter({
          writer,
          method: 'post',
          path: '/',
          handler: 'create(json)',
          status: 201,
          json: createInputIdentifier,
        });

        apiHandlerWriter({
          writer,
          method: 'get',
          path: '/',
          handler: 'find(query)',
          status: 200,
          query: listFilterIdentifier,
        });

        apiHandlerWriter({
          writer,
          method: 'put',
          path: '/instance',
          handler: 'update(query, json)',
          status: 200,
          json: updateInputIdentifier,
          query: uniqueFilterIdentifier,
        });

        apiHandlerWriter({
          writer,
          method: 'delete',
          path: '/instance',
          handler: 'delete(query)',
          status: 200,
          query: uniqueFilterWhereIdentifier,
        });

        apiHandlerWriter({
          writer,
          method: 'get',
          path: '/instance',
          handler: 'findUnique(query)',
          status: 200,
          query: uniqueFilterIdentifier,
        });

        writer.writeLine('return app;');
      });
    },
  });

  return file;
};
