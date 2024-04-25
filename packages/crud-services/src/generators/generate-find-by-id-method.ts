import { DMMF } from '@prisma/generator-helper';
import { ClassDeclaration, ImportDeclaration } from 'ts-morph';

type GenerateFindByIdMethodOptions = {
  serviceClass: ClassDeclaration;
  model: DMMF.Model;
};

export const generateFindByIdMethod = ({ serviceClass, model }: GenerateFindByIdMethodOptions) => {
  const method = serviceClass.addMethod({
    name: 'findById',
    isAsync: true,
    parameters: [{ name: 'where', type: `Prisma.${model.name}WhereUniqueInput` }],
  });

  method.addStatements(`
    try {
      const instance = await this.prisma.${model.name.toLowerCase()}.findUnique({
        where,
      });
      
      return ok(instance);
    } catch (e) {
      return err(translateToErrno(e as Error, 'UNKNOWN_ERROR', [], 500));
    }
  `);
};
