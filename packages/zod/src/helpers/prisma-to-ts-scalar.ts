import { PrismaScalar } from '../constants/prisma-scalars';
import { PRISMA_TS_SCALAR } from '../constants/prisma-ts-scalar';

export const prismaToTsScalar = (type: PrismaScalar) => {
  return PRISMA_TS_SCALAR[type];
};
