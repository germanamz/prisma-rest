import { prismaToZodScalar } from '../../src/helpers/prisma-to-zod-scalar';

describe('prismaToZodScalar', () => {
  test('String -> string', () => {
    expect(prismaToZodScalar('String')).toBe('string');
  });

  test('Float -> number', () => {
    expect(prismaToZodScalar('Float')).toBe('number');
  });

  test('Decimal -> number', () => {
    expect(prismaToZodScalar('Decimal')).toBe('number');
  });

  test('BigInt -> bigint', () => {
    expect(prismaToZodScalar('BigInt')).toBe('bigint');
  });

  test('Boolean -> boolean', () => {
    expect(prismaToZodScalar('Boolean')).toBe('boolean');
  });

  test('DateTime -> date', () => {
    expect(prismaToZodScalar('DateTime')).toBe('date');
  });

  test('Json -> any', () => {
    expect(prismaToZodScalar('Json')).toBe('any');
  });

  test('Null -> null', () => {
    expect(prismaToZodScalar('Null')).toBe('null');
  });

  test('Bytes -> any', () => {
    expect(prismaToZodScalar('Bytes')).toBe('any');
  });
});
