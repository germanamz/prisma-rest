import { genZodScalar } from '../../src/helpers/gen-zod-scalar';

describe('genZodScalar', () => {
  it('should generate a required zod type', () => {
    expect(genZodScalar('String', false, true)).toEqual('z.string()');
  });

  it('should generate a nullish zod type', () => {
    expect(genZodScalar('String', false, false)).toEqual('z.string().nullish()');
  });

  it('should generate a list zod type', () => {
    expect(genZodScalar('String', true, true)).toEqual('z.array(z.string())');
  });

  it('should generate a nullish list zod type', () => {
    expect(genZodScalar('String', true, false)).toEqual('z.array(z.string()).nullish()');
  });
});
