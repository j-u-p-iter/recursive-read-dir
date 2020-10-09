import path from 'path';
import { readDir } from '../.';

const getAbsolutePath = (relativePath) => {
  return path.resolve(__dirname, relativePath); 
};

describe('readDir', () => {
  it('works properly', async () => {
    const entries = await readDir(getAbsolutePath('./fixtures'));
    
    expect(entries).toEqual(
      {
        "./": [
          getAbsolutePath('./fixtures/file.txt')
        ], 

        "/folder": [
          getAbsolutePath('./fixtures/folder/anotherFile.txt'),
          getAbsolutePath('./fixtures/folder/newFile.txt'),
        ], 

        "/folder/newFolder": [
          getAbsolutePath('./fixtures/folder/newFolder/oneMoreFile.txt'),
        ],
      }
    );
  });
});
