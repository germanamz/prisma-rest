import { Project, VariableDeclarationKind } from 'ts-morph';
import { addToImportQueue, ImportQueue, Registry } from '@germanamz/prisma-rest-toolbox';
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

  file.addImportDeclaration({
    moduleSpecifier: 'hono',
    namedImports: ['Hono'],
  });
  file.addImportDeclaration({
    moduleSpecifier: 'hono/utils/http-status',
    namedImports: ['StatusCode'],
  });
  file.addImportDeclaration({
    moduleSpecifier: '@hono/zod-validator',
    namedImports: ['zValidator'],
  });

  addToImportQueue(importQueue, file, [
    createInputIdentifier,
    serviceName,
  ]);

  file.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: apiName,
        initializer: (writer) => {
          writer.write(`(service: ${serviceName}) => `);

          writer.block(() => {
            writer.writeLine('const app = new Hono();');

            writer.blankLine();

            apiHandlerWriter({
              writer,
              method: 'post',
              path: '/',
              handler: 'create(json)',
              status: 201,
              json: createInputIdentifier,
            });

            writer.writeLine('return app;');
          });
        },
      },
    ],
  });

  registry.set(apiName, file);

  return file;
};
