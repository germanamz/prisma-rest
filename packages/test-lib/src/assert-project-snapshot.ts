import { Project } from 'ts-morph';

export const assertProjectSnapshot = (project: Project) => {
  project.getSourceFiles().forEach((sourceFile) => {
    expect(sourceFile.getText()).toMatchSnapshot();
  });
};
