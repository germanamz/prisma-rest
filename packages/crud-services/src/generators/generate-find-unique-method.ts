import { DMMF } from '@prisma/generator-helper';
import { ClassDeclaration } from 'ts-morph';

type GenerateFindByIdMethodOptions = {
  serviceClass: ClassDeclaration;
  model: DMMF.Model;
};

export const generateFindUniqueMethod = ({ serviceClass, model }: GenerateFindByIdMethodOptions) => {
  const method = serviceClass.addMethod({
    name: 'findUnique',
    isAsync: true,
    parameters: [{ name: 'filter', type: `{ where: Prisma.${model.name}WhereUniqueInput; select?: Prisma.${model.name}Select }` }],
  });

  method.addStatements(`
    try {
      const instance = await this.prisma.${model.name.toLowerCase()}.findUnique({
        where: filter.where,
        select: filter.select,
      });
      
      return ok(instance);
    } catch (e) {
      return err(translateToErrno(e, 'ERROR', 500, [e]));
    }
  `);
};
