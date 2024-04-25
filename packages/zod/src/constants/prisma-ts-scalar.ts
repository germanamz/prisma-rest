export const PRISMA_TS_SCALAR = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Decimal: 'number',
  BigInt: 'BigInt',
  Boolean: 'boolean',
  DateTime: 'Date',
  Json: 'any',
  Bytes: 'any',
} as const;

export type PrismaTsScalar = keyof typeof PRISMA_TS_SCALAR;
