import 'tslib';

const generatorHandlerMock = jest.fn();

jest.mock('@prisma/generator-helper', () => ({
  generatorHandler: (...args: any) => generatorHandlerMock(...args),
}));
jest.mock('../src/bin-api', () => ({
  onManifest: jest.fn(),
  onGenerate: jest.fn(),
}));

describe('bin', () => {
  it('should trigger generation', async () => {
    await import('../src/bin');

    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    expect(generatorHandlerMock).toHaveBeenCalledWith({
      onManifest: expect.any(Function),
      onGenerate: expect.any(Function),
    });
  });
});
