import { MarshalDocument } from '@germanamz/prisma-rest-marshal';
import { getDMMF } from '@prisma/internals';
import * as path from 'node:path';
import { Project } from 'ts-morph';
import { GeneratorOptions } from '@prisma/generator-helper';
import { onManifest, onGenerate } from '../src/bin-api';

const makeGeneratorContextMock = jest.fn();
const generateZodMock = jest.fn();
const projectSaveMock = jest.fn();

jest.mock('@germanamz/prisma-rest-toolbox', () => {
  const actual = jest.requireActual('@germanamz/prisma-rest-toolbox');

  return {
    makeGeneratorContext: (...args: any) => {
      makeGeneratorContextMock.mockImplementation((...inArgs: any) => {
        const ctx = actual.makeGeneratorContext(...inArgs);

        ctx.project.save = projectSaveMock;

        return ctx;
      });

      return makeGeneratorContextMock(...args);
    },
  };
});
jest.mock('../src/generators/generate-zod', () => ({
  generateZod: (...args: any) => generateZodMock(...args),
}));

describe('bin-api', () => {
  describe('onManifest', () => {
    it('should return the manifest', async () => {
      const manifest = onManifest();

      expect(manifest).toEqual({
        defaultOutput: './zod',
        prettyName: 'Zod schemas',
      });
    });
  });

  describe('onGenerate', () => {
    it('should generate zod and make a context', async () => {
      const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
      const dmmf = await getDMMF({ datamodelPath: schemaPath });

      await onGenerate({
        schemaPath,
        generator: {
          output: {
            fromEnvVar: null,
            value: './zod',
          },
        },
        dmmf,
      } as unknown as GeneratorOptions);

      expect(makeGeneratorContextMock).toHaveBeenCalledTimes(1);
      expect(makeGeneratorContextMock.mock.calls[0][0].dir).toEqual('./zod');
      expect(makeGeneratorContextMock.mock.calls[0][0].dmmf).toEqual(expect.any(Object));
      expect(generateZodMock).toHaveBeenCalledTimes(1);
      expect(generateZodMock.mock.calls[0][0].dir).toEqual('./zod');
      expect(generateZodMock.mock.calls[0][0].dmmf).toEqual(expect.any(Object));
      expect(generateZodMock.mock.calls[0][0].project).toBeInstanceOf(Project);
      expect(generateZodMock.mock.calls[0][0].importQueue).toBeInstanceOf(Map);
      expect(generateZodMock.mock.calls[0][0].registry).toBeInstanceOf(Map);
      expect(generateZodMock.mock.calls[0][0].marshalDocument)
        .toBeInstanceOf(MarshalDocument);
      expect(projectSaveMock).toHaveBeenCalled();
    });

    it('should generate zod and make a context without output path', async () => {
      const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
      const dmmf = await getDMMF({ datamodelPath: schemaPath });
      const dir = path.join(path.dirname(schemaPath), 'zod');

      await onGenerate({
        schemaPath,
        generator: {},
        dmmf,
      } as unknown as GeneratorOptions);

      expect(makeGeneratorContextMock).toHaveBeenCalledTimes(1);
      expect(makeGeneratorContextMock.mock.calls[0][0].dir).toEqual(dir);
      expect(makeGeneratorContextMock.mock.calls[0][0].dmmf).toEqual(expect.any(Object));
      expect(generateZodMock).toHaveBeenCalledTimes(1);
      expect(generateZodMock.mock.calls[0][0].dir).toEqual(dir);
      expect(generateZodMock.mock.calls[0][0].dmmf).toEqual(expect.any(Object));
      expect(generateZodMock.mock.calls[0][0].project).toBeInstanceOf(Project);
      expect(generateZodMock.mock.calls[0][0].importQueue).toBeInstanceOf(Map);
      expect(generateZodMock.mock.calls[0][0].registry).toBeInstanceOf(Map);
      expect(generateZodMock.mock.calls[0][0].marshalDocument)
        .toBeInstanceOf(MarshalDocument);
      expect(projectSaveMock).toHaveBeenCalled();
    });
  });
});
