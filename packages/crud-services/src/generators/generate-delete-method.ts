import { ClassDeclaration } from 'ts-morph';
import { MarshalModel } from '@germanamz/prisma-rest-marshal';

export type GenerateDeleteMethodOptions = {
  model: MarshalModel;
  serviceClass: ClassDeclaration;
};

export const generateDeleteMethod = ({ model, serviceClass }: GenerateDeleteMethodOptions) => {
  const method = serviceClass.addMethod({
    name: 'delete',
    isAsync: true,
    parameters: [
      { name: 'where', type: `Prisma.${model.name}WhereUniqueInput` },
    ],
  });

  method.addStatements(`
    try {
      const deletedInstance = await this.prisma.${model.name.toLowerCase()}.delete({
        where,
      });
      
      return ok(deletedInstance);
    } catch (e) {
      return err(translateToErrno(e, 'ERROR', 500, [e]));
    }
  `);
};
