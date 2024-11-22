import { Project } from 'ts-morph';
import { getMockDir } from './get-mock-dir';

export const assertProjectSnapshot = (project: Project) => {
  project.getSourceFiles().forEach((sourceFile) => {
    expect(sourceFile).not.toBeUndefined();
    expect(sourceFile.getFilePath()).toMatch(new RegExp(`^${getMockDir()}.*`));
    expect(
      `Source file path: ${sourceFile.getFilePath()}
---------------------------------------------
${sourceFile.getText()}`,
    ).toMatchSnapshot();
  });
};
