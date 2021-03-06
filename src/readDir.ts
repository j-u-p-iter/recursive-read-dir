import fs from "fs";
import path from "path";

type FilePath = string;

interface PathsTree {
  [dirPath: string]: FilePath;
}

type PathsCollection = FilePath[];

const ROOT_PATH = "./";

export const readDir = async (
  rootDirectoryPath: string
): Promise<PathsTree | PathsCollection> => {
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
    } else {
      const newEntries = await fs.promises.readdir(entryPath);

      entries.push(...newEntries.map(newEntry => `${entry}/${newEntry}`));
    }
  }

  return resultTree;
};
