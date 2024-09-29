import { prismaToZodScalar } from './prisma-to-zod-scalar';

export const genZodScalar = (prismaType: string, isList: boolean, isRequired: boolean) => {
  let zod = `z.${prismaToZodScalar(prismaType)}()`;

  if (isList) {
    zod = `z.array(${zod})`;
  }

  if (!isRequired) {
    zod = `${zod}.nullish()`;
  }

  return zod;
};
