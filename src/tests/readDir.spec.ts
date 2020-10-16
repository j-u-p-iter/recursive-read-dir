import path from 'path';
import { readDir, Format } from '../.';

const getAbsolutePath = (relativePath) => {
  return path.resolve(__dirname, relativePath); 
};

describe('readDir', () => {
  describe('with TREE format by default', () => {
    it('works properly', async () => {
      const entries = await readDir(getAbsolutePath('./fixtures'));
      
      expect(entries).toEqual(
        {
          "./": [
            getAbsolutePath('./fixtures/file.txt')
          ], 

          "/folder": [
            getAbsolutePath('./fixtures/folder/anotherFile.txt'),
            getAbsolutePath('./fixtures/folder/file.spec.txt'),
            getAbsolutePath('./fixtures/folder/newFile.txt'),
          ], 

          "/folder/newFolder": [
            getAbsolutePath('./fixtures/folder/newFolder/file.spec.txt'),
            getAbsolutePath('./fixtures/folder/newFolder/oneMoreFile.txt'),
          ],
        }
      );
    });
  })

  describe('with FILES format', () => {
    it('works properly', async () => {
      const entries = await readDir(getAbsolutePath('./fixtures'), { format: Format.FILES });
      
      expect(entries).toEqual([
        getAbsolutePath('./fixtures/file.txt'),
        getAbsolutePath('./fixtures/folder/anotherFile.txt'),
        getAbsolutePath('./fixtures/folder/file.spec.txt'),
        getAbsolutePath('./fixtures/folder/newFile.txt'),
        getAbsolutePath('./fixtures/folder/newFolder/file.spec.txt'),
        getAbsolutePath('./fixtures/folder/newFolder/oneMoreFile.txt'),
      ]);
    });
  });

  describe('with DIRECTORIES format', () => {
    it('works properly', async () => {
      const entries = await readDir(getAbsolutePath('./fixtures'), { format: Format.DIRECTORIES });
      
      expect(entries).toEqual([ './', '/folder', '/folder/newFolder' ]);
    });
  });

  describe('with dirPatternToExclude', () => {
    describe('with TREE format by default', () => {
      it('works properly', async () => {
        const entries = await readDir(getAbsolutePath('./fixtures'), { dirPatternToExclude: 'newFolder' });
        
        expect(entries).toEqual(
          {
            "./": [
              getAbsolutePath('./fixtures/file.txt')
            ], 

            "/folder": [
              getAbsolutePath('./fixtures/folder/anotherFile.txt'),
              getAbsolutePath('./fixtures/folder/file.spec.txt'),
              getAbsolutePath('./fixtures/folder/newFile.txt'),
            ], 
          }
        );
      });
    })

    describe('with FILES format', () => {
      it('works properly', async () => {
        const entries = await readDir(getAbsolutePath('./fixtures'), { format: Format.FILES, dirPatternToExclude: 'newFolder' });
        
        expect(entries).toEqual([
          getAbsolutePath('./fixtures/file.txt'),
          getAbsolutePath('./fixtures/folder/anotherFile.txt'),
          getAbsolutePath('./fixtures/folder/file.spec.txt'),
          getAbsolutePath('./fixtures/folder/newFile.txt'),
        ]);
      });
    });

    describe('with DIRECTORIES format', () => {
      it('works properly', async () => {
        const entries = await readDir(getAbsolutePath('./fixtures'), { format: Format.DIRECTORIES, dirPatternToExclude: 'newFolder' });
        
        expect(entries).toEqual([ './', '/folder' ]);
      });
    });
  });

  describe('with filePatternToInclude', () => {
    describe('with TREE format by default', () => {
      it('works properly', async () => {
        const entries = await readDir(getAbsolutePath('./fixtures'), { filePatternToInclude: '.spec.txt' });
        
        expect(entries).toEqual(
          {
            "/folder": [
              getAbsolutePath('./fixtures/folder/file.spec.txt'),
            ], 
            "/folder/newFolder": [
              getAbsolutePath('./fixtures/folder/newFolder/file.spec.txt'),
            ]
          }
        );
      });
    })

    describe('with FILES format', () => {
      it('works properly', async () => {
        const entries = await readDir(getAbsolutePath('./fixtures'), { format: Format.FILES, filePatternToInclude: '.spec.txt' });
        
        expect(entries).toEqual([
          getAbsolutePath('./fixtures/folder/file.spec.txt'),
          getAbsolutePath('./fixtures/folder/newFolder/file.spec.txt'),
        ]);
      });
    });

    describe.only('with DIRECTORIES format', () => {
      it('works properly', async () => {
        const entries = await readDir(getAbsolutePath('./fixtures'), { format: Format.DIRECTORIES, filePatternToInclude: '.spec.txt' });
        
        expect(entries).toEqual([ '/folder', '/folder/newFolder' ]);
      });
    });
  });
});
