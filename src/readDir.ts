import fs from "fs";
import path from "path";

export type FilePath = string;

export type DirPath = string;

export type PathsCollection = FilePath[];

export interface PathsTree {
  [dirPath: string]: PathsCollection;
}

export type DirectoriesCollection = DirPath[];

export enum Format {
  TREE = "tree",
  FILES = "files",
  DIRECTORIES = "directories"
}

interface Options {
  format?: Format;
}

const ROOT_PATH = "./";

const extractFilesFromTree = (tree: PathsTree): FilePath[] => {
  return Object.values(tree).reduce<FilePath[]>(
    (filePaths, filePathsForDir) => {
      return [...filePaths, ...filePathsForDir];
    },
    []
  );
};

const extractDirectoriesFromTree = (tree: PathsTree): DirPath[] =>
  Object.keys(tree);

const formatData = (
  resultTree: PathsTree,
  format: Format
): PathsTree | PathsCollection | DirectoriesCollection => {
  switch (format) {
    case Format.FILES:
      return extractFilesFromTree(resultTree);

    case Format.DIRECTORIES:
      return extractDirectoriesFromTree(resultTree);

    case Format.TREE:
    default:
      return resultTree;
  }
};

export const readDir = async (
  rootDirectoryPath: string,
  options: Options = { format: Format.TREE }
): Promise<PathsTree | PathsCollection | DirectoriesCollection> => {
  const { format } = options;

  const resultTree = {};

  const entries = await fs.promises.readdir(rootDirectoryPath);

  for (const entry of entries) {
    const entryPath = path.resolve(rootDirectoryPath, entry);

    const entryStat = await fs.promises.lstat(entryPath);

    if (entryStat.isFile()) {
      const parentDirName =
        path.dirname(entryPath).replace(rootDirectoryPath, "") || ROOT_PATH;

      resultTree[parentDirName] = resultTree[parentDirName] || [];

      resultTree[parentDirName] = [...resultTree[parentDirName], entryPath];
    } else if (entryStat.isDirectory()) {
      const newEntries = await fs.promises.readdir(entryPath);

      entries.push(...newEntries.map(newEntry => `${entry}/${newEntry}`));
    }
  }

  return formatData(resultTree, format);
};
