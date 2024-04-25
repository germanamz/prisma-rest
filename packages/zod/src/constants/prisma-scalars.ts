export const PRISMA_SCALAR = {
  String: 'String',
  Int: 'Int',
  Float: 'Float',
  Decimal: 'Decimal',
  BigInt: 'BigInt',
  Boolean: 'Boolean',
  DateTime: 'DateTime',
  Json: 'Json',
  Bytes: 'Bytes',
} as const;

export type PrismaScalar = keyof typeof PRISMA_SCALAR;
