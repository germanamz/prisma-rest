import { DMMF } from '@prisma/generator-helper';
import { Project } from 'ts-morph';
import {
  createSourceFile, declareConstant, ImportQueue, Registry,
} from '@germanamz/prisma-rest-toolbox';

const operatorTypes = [
  {
    name: 'String',
    type: 'string',
  },
  {
    name: 'Number',
    type: 'number',
  },
  {
    name: 'Date',
    type: 'coerce.date',
  },
  {
    name: 'Boolean',
    type: 'boolean',
  },
];

export type GenerateGlobalCrudBasicsOptions = {
  dmmf: DMMF.Document;
  project: Project;
  dir: string;
  registry: Registry;
  importQueue: ImportQueue;
};

export const generateGlobalCrudBasics = (options: GenerateGlobalCrudBasicsOptions) => {
  const {
    project,
    dir,
    registry,
  } = options;
  const sourceFile = createSourceFile({
    project,
    dir,
    name: 'GlobalCrudBasics',
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: ['z', 'ZodIssueCode'],
  });

  declareConstant({
    sourceFile,
    registry,
    isExported: true,
    name: 'OrderDirection',
    initializer: 'z.enum([\'asc\', \'desc\'])',
  });

  declareConstant({
    sourceFile,
    registry,
    isExported: true,
    name: 'parseJsonPreprocessor',
    initializer: `(value: any, ctx: z.RefinementCtx) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: (e as Error).message,
      });
    }
  }

  return value;
}`,
  });

  declareConstant({
    sourceFile,
    registry,
    isExported: true,
    name: 'StringFilterMode',
    initializer: 'z.enum([\'default\', \'insensitive\'])',
  });

  operatorTypes.forEach((operatorType) => {
    declareConstant({
      name: `${operatorType.name}FilterOperatorType`,
      sourceFile,
      registry,
      isExported: true,
      initializer: `z.${operatorType.type}()`,
    });

    declareConstant({
      name: `${operatorType.name}EqualityFilterOperators`,
      sourceFile,
      registry,
      isExported: true,
      initializer: (writer) => {
        writer.write('z.object({');

        writer.writeLine(`equals: ${operatorType.name}FilterOperatorType.optional(),`);
        writer.writeLine(`not: ${operatorType.name}FilterOperatorType.optional(),`);
        writer.writeLine(`in: z.array(${operatorType.name}FilterOperatorType).optional(),`);
        writer.writeLine(`notIn: z.array(${operatorType.name}FilterOperatorType).optional(),`);

        writer.write('})');
      },
    });
  });

  declareConstant({
    name: 'BooleanFilterOperators',
    sourceFile,
    registry,
    isExported: true,
    initializer: 'BooleanEqualityFilterOperators',
  });

  declareConstant({
    name: 'StringFilterOperators',
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.object({');

      writer.writeLine('contains: z.string().optional(),');
      writer.writeLine('startsWith: z.string().optional(),');
      writer.writeLine('endsWith: z.string().optional(),');
      writer.writeLine('mode: StringFilterMode.optional(),');

      writer.write('}).merge(StringEqualityFilterOperators)');
    },
  });

  declareConstant({
    name: 'NumberFilterOperators',
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.object({');

      writer.writeLine('lt: z.number().optional(),');
      writer.writeLine('lte: z.number().optional(),');
      writer.writeLine('gt: z.number().optional(),');
      writer.writeLine('gte: z.number().optional(),');

      writer.write('}).merge(NumberEqualityFilterOperators)');
    },
  });

  declareConstant({
    name: 'DateFilterOperators',
    sourceFile,
    registry,
    isExported: true,
    initializer: (writer) => {
      writer.write('z.object({');

      writer.writeLine('lt: z.coerce.date().optional(),');
      writer.writeLine('lte: z.coerce.date().optional(),');
      writer.writeLine('gt: z.coerce.date().optional(),');
      writer.writeLine('gte: z.coerce.date().optional(),');

      writer.write('}).merge(DateEqualityFilterOperators)');
    },
  });

  return sourceFile;
};
