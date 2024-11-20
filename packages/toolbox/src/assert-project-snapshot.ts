import { Project } from 'ts-morph';

export const assertProjectSnapshot = async (project: Project) => {
  project.getSourceFiles().forEach((sourceFile) => {
    expect(sourceFile.getText()).toMatchSnapshot();
  });
};
