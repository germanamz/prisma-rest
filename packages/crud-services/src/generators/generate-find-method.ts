import { ClassDeclaration } from 'ts-morph';
import { MarshalModel } from '@germanamz/prisma-rest-marshal';

type GenerateFindMethodOptions = {
  serviceClass: ClassDeclaration;
  model: MarshalModel;
};

export const generateFindMethod = ({ serviceClass, model }: GenerateFindMethodOptions) => {
  const method = serviceClass.addMethod({
    name: 'find',
    isAsync: true,
    parameters: [{ name: 'filter', type: `{ where: Prisma.${model.name}WhereInput; skip?: number; take?: number; orderBy?: Prisma.${model.name}OrderByWithRelationInput | Prisma.${model.name}OrderByWithRelationInput[]; select?: Prisma.${model.name}Select }` }],
  });

  method.addStatements(`
    try {
      const instance = await this.prisma.${model.name.toLowerCase()}.findMany({
        where: filter.where,
        skip: filter.skip,
        take: filter.take,
        orderBy: filter.orderBy,
        select: filter.select,
      });
      
      return ok(instance);
    } catch (e) {
      return err(translateToErrno(e, 'ERROR', 500, [e]));
    }
  `);
};
