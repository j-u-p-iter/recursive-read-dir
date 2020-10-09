import { readDir } from '../.';

describe('readDir', () => {
  it('works properly', async () => {
    const entries = await readDir(`${__dirname}/fixtures`);
    
    expect(entries).toEqual(
      {
        "./": [
          "/Users/j.u.p.iter/projects/recursive-read-dir/src/tests/fixtures/file.txt"
        ], 

        "/folder": [
          "/Users/j.u.p.iter/projects/recursive-read-dir/src/tests/fixtures/folder/anotherFile.txt",
          "/Users/j.u.p.iter/projects/recursive-read-dir/src/tests/fixtures/folder/newFile.txt",
        ], 

        "/folder/newFolder": [
          "/Users/j.u.p.iter/projects/recursive-read-dir/src/tests/fixtures/folder/newFolder/oneMoreFile.txt"
        ],
      }
    );
  });
});
