import { ClassDeclaration } from 'ts-morph';
import { MarshalModel } from '@germanamz/prisma-rest-marshal';

export type GenerateUpdateMethodOptions = {
  model: MarshalModel;
  serviceClass: ClassDeclaration;
};

export const generateUpdateMethod = ({ model, serviceClass }: GenerateUpdateMethodOptions) => {
  const method = serviceClass.addMethod({
    name: 'update',
    isAsync: true,
    parameters: [
      { name: 'filter', type: `{ where: Prisma.${model.name}WhereUniqueInput; select?: Prisma.${model.name}Select }` },
      { name: 'data', type: `Prisma.${model.name}UncheckedUpdateInput` },
    ],
  });

  method.addStatements(`
  try {
    const instance = await this.prisma.${model.name.toLowerCase()}.update({
      where: filter.where,
      select: filter.select,
      data,
    });
    
    return ok(instance);
  } catch (e) {
    return err(translateToErrno(e, 'ERROR', 500, [e]));
  }
  `);
};
