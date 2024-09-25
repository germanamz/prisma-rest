import { SourceFile, VariableDeclarationKind, WriterFunction } from 'ts-morph';
import { Registry } from './registry';

export type DeclareConstantOptions = {
  sourceFile: SourceFile;
  name: string;
  registry: Registry;
  isExported?: boolean;
  initializer: string | WriterFunction;
};

export const declareConstant = ({
  name, sourceFile, initializer, isExported, registry,
}: DeclareConstantOptions) => {
  const statement = sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported,
    declarations: [
      {
        name,
        initializer,
      },
    ],
  });

  registry.set(name, sourceFile);

  return statement;
};
