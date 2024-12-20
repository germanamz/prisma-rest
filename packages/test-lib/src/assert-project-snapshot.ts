import { Project } from 'ts-morph';
import { getMockDir } from './get-mock-dir';

/**
 * Asserts that project snapshot is correct checks file content, path and order.
 *
 * @param project
 */
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
