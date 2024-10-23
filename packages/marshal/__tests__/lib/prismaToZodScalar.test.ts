import { prismaToZodScalar } from '../../src/lib/prismaToZodScalar';

describe('prismaToZodScalar', () => {
  it('should translate String', () => {
    expect(prismaToZodScalar('String')).toBe('string');
  });

  it('should translate Int', () => {
    expect(prismaToZodScalar('Int')).toBe('number');
  });

  it('should translate Float', () => {
    expect(prismaToZodScalar('Float')).toBe('number');
  });

  it('should translate Decimal', () => {
    expect(prismaToZodScalar('Decimal')).toBe('number');
  });

  it('should translate BigInt', () => {
    expect(prismaToZodScalar('BigInt')).toBe('bigint');
  });

  it('should translate Boolean', () => {
    expect(prismaToZodScalar('Boolean')).toBe('boolean');
  });

  it('should translate DateTime', () => {
    expect(prismaToZodScalar('DateTime')).toBe('date');
  });

  it('should translate Json', () => {
    expect(prismaToZodScalar('Json')).toBe('any');
  });

  it('should translate Bytes', () => {
    expect(prismaToZodScalar('Bytes')).toBe('any');
  });
});
