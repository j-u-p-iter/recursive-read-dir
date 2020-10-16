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
  dirPatternToExclude?: string;
  filePatternToInclude?: string;
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

const needToBeExcluded = (dirPath, patternToExclude): boolean => {
  if (!patternToExclude) {
    return false;
  }

  const patternRegExp = new RegExp(patternToExclude);

  return patternRegExp.test(dirPath);
};

const needToBeIncluded = (filePath, patternToInclude): boolean => {
  if (!patternToInclude) {
    return true;
  }

  const patternRegExp = new RegExp(patternToInclude);

  return patternRegExp.test(filePath);
};

export const readDir = async (
  rootDirectoryPath: string,
  options: Options = { format: Format.TREE }
): Promise<PathsTree | PathsCollection | DirectoriesCollection> => {
  const { format, dirPatternToExclude, filePatternToInclude } = options;

  const resultTree = {};

  const entries = await fs.promises.readdir(rootDirectoryPath);

  for (const entry of entries) {
    const entryPath = path.resolve(rootDirectoryPath, entry);

    const entryStat = await fs.promises.lstat(entryPath);

    if (entryStat.isFile()) {
      if (needToBeIncluded(entryPath, filePatternToInclude)) {
        const parentDirName =
          path.dirname(entryPath).replace(rootDirectoryPath, "") || ROOT_PATH;

        resultTree[parentDirName] = resultTree[parentDirName] || [];

        resultTree[parentDirName] = [...resultTree[parentDirName], entryPath];
      }
    } else if (entryStat.isDirectory()) {
      if (!needToBeExcluded(entryPath, dirPatternToExclude)) {
        const newEntries = await fs.promises.readdir(entryPath);

        entries.push(...newEntries.map(newEntry => `${entry}/${newEntry}`));
      }
    }
  }

  return formatData(resultTree, format);
};
