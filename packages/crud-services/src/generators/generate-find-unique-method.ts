import { ClassDeclaration } from 'ts-morph';
import { MarshalModel } from '@germanamz/prisma-rest-marshal';

type GenerateFindByIdMethodOptions = {
  serviceClass: ClassDeclaration;
  model: MarshalModel;
};

export const generateFindUniqueMethod = (options: GenerateFindByIdMethodOptions) => {
  const { serviceClass, model } = options;
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
