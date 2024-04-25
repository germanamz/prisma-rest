import { PRISMA_SCALAR, PrismaScalar } from '../constants/prisma-scalars';

export const isPrismaScalar = (type: string): type is PrismaScalar => {
  return type in PRISMA_SCALAR;
};
