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
