import { DMMF } from '@prisma/generator-helper';
import { ClassDeclaration } from 'ts-morph';

export type GenerateDeleteMethodOptions = {
  model: DMMF.Model;
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
