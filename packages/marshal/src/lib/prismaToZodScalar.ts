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

export const PRISMA_ZOD_SCALAR_MAP = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Decimal: 'number',
  BigInt: 'bigint',
  Boolean: 'boolean',
  DateTime: 'date',
  Json: 'any',
  Null: 'null',
  // Prisma maps Bytes to Buffer but zod does not have buffer support,
  // 'any' is the easiest way to handle this
  // TODO: Buffers should be transformed to base64 strings
  Bytes: 'any',
} as const;

export const prismaToZodScalar = (type: string) => PRISMA_ZOD_SCALAR_MAP[type as PrismaScalar];
