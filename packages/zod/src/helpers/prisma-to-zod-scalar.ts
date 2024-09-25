import { PrismaScalar } from '../constants/prisma-scalars';
import { PRISMA_ZOD_SCALAR_MAP } from '../constants/prisma-zod-scalar-map';

export const prismaToZodScalar = (type: string) => {
  return PRISMA_ZOD_SCALAR_MAP[type as PrismaScalar];
};
