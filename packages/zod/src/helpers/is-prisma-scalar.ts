import { PRISMA_SCALAR, PrismaScalar } from '../constants/prisma-scalars';

export const isPrismaScalar = (type: string): type is PrismaScalar => type in PRISMA_SCALAR;
