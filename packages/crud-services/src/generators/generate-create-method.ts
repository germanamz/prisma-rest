import { ClassDeclaration } from 'ts-morph';
import { MarshalModel } from '@germanamz/prisma-rest-marshal';

type GenerateCreateMethodOptions = {
  serviceClass: ClassDeclaration;
  model: MarshalModel;
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
    return err(translateToErrno(e, 'ERROR', 500, [e]));
  }
  `);
};
