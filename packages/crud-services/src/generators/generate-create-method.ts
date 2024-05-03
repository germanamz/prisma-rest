import { DMMF } from '@prisma/generator-helper';
import { ClassDeclaration, ImportDeclaration } from 'ts-morph';

type GenerateCreateMethodOptions = {
  serviceClass: ClassDeclaration;
  model: DMMF.Model;
};

export const generateCreateMethod = ({ serviceClass, model }: GenerateCreateMethodOptions) => {
  const method = serviceClass.addMethod({
    name: 'create',
    isAsync: true,
    parameters: [{ name: 'data', type: `Prisma.${model.name}UncheckedCreateInput` }],
  });

  method.addStatements(`
  try {
    const instance = await this.prisma.${model.name.toLowerCase()}.create({
      data,
    });
    
    return ok(instance);
  } catch (e) {
    return err(translateToErrno(e as Error, 'UNKNOWN_ERROR', [], 500));
  }
  `);
};
