import { DMMF } from '@prisma/generator-helper';
import { ClassDeclaration } from 'ts-morph';

export type GenerateUpdateMethodOptions = {
  model: DMMF.Model;
  serviceClass: ClassDeclaration;
};

export const generateUpdateMethod = ({ model, serviceClass }: GenerateUpdateMethodOptions) => {
  const method = serviceClass.addMethod({
    name: 'update',
    isAsync: true,
    parameters: [
      { name: 'where', type: `Prisma.${model.name}WhereUniqueInput` },
      { name: 'data', type: `Prisma.${model.name}CreateInput` },
    ],
  });

  method.addStatements(`
  try {
    const instance = await this.prisma.${model.name.toLowerCase()}.update({
      where,
      data,
    });
    
    return ok(instance);
  } catch (e) {
    return err(translateToErrno(e as Error, 'UNKNOWN_ERROR', [], 500));
  }
  `);
};
