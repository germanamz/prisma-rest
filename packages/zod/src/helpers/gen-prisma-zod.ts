import { PrismaScalar } from '../constants/prisma-scalars';
import { genZod } from './gen-zod';
import { prismaToZodScalar } from './prisma-to-zod-scalar';

export type GenPrismaZodOptions = {
  type: PrismaScalar;
  isList?: boolean;
  isRequired?: boolean;
  isNullable?: boolean;
};

export const genPrismaZod = ({ type, isList, isNullable, isRequired }: GenPrismaZodOptions) => {
  const zodScalar = prismaToZodScalar(type);

  return genZod({
    type: zodScalar,
    isList,
    isNullable,
    isRequired,
  });
};
