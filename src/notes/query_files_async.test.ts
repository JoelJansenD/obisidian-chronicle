import { App, CachedMetadata, FrontMatterCache, MetadataCache, TFile, Vault } from "obsidian";
import queryFilesAsync from "./query_files_async";

describe('queryFilesAsync', () => {

    it('returns all files that fit the query', async () => {
        // Arrange
        const expectedFilesWithFrontmatter = [
            { file: new TFile(), frontmatter: { id: 1, name: 'valid' } },
            { file: new TFile(), frontmatter: { id: 3, name: 'valid' } },
        ];
        const mockInput = new MockInput([...expectedFilesWithFrontmatter, { file: new TFile(), frontmatter: {id: 2, name: 'invalid'} }]);
        const mocks = new Mocks(mockInput);
        const sut = getSut(mocks);

        // Act
        const result = await queryFilesAsync(sut, item => item.frontmatter?.name === 'valid');

        // Assert
        expect(result).toHaveLength(expectedFilesWithFrontmatter.length);
        expect(result[0].frontmatter!.id).toBe(1);
        expect(result[1].frontmatter!.id).toBe(3);
    });

    it('value of frontmatter is null for files without frontmatter', async () => {
        // Arrange
        const expectedFilesWithFrontmatter = [
            { file: new TFile(), frontmatter: { id: 1, name: 'not undefined' } },
            { file: new TFile(), frontmatter: undefined },
        ];
        const mockInput = new MockInput([...expectedFilesWithFrontmatter]);
        const mocks = new Mocks(mockInput);
        const sut = getSut(mocks);

        // Act & Assert
        await queryFilesAsync(sut, item => {
            const expectedFileWithFrontmatter = expectedFilesWithFrontmatter.find(f => f.file === item.file);
            // Obsidian used undefined, the query item turns that into null
            if(expectedFileWithFrontmatter!.frontmatter === undefined) {
                expect(item.frontmatter).toBeNull();
            }
            else {
                expect(item.frontmatter).toBe(expectedFileWithFrontmatter!.frontmatter);
            }

            // Return value doesn't matter for this test
            return true;
        });
    });

    it('value of frontmatter is null if no cache is found', async () => {
        // Arrange
        const expectedFilesWithFrontmatter = [
            { file: new TFile(), frontmatter: { id: 1, name: 'not undefined' } },
            { file: new TFile(), frontmatter: undefined },
        ];
        const mockInput = new MockInput([...expectedFilesWithFrontmatter]);
        const mocks = new Mocks(mockInput);
        const sut = getSut(mocks);

        // Act & Assert
        await queryFilesAsync(sut, item => {
            const expectedFileWithFrontmatter = expectedFilesWithFrontmatter.find(f => f.file === item.file);
            // Obsidian used undefined, the query item turns that into null
            if(expectedFileWithFrontmatter!.frontmatter === undefined) {
                expect(item.frontmatter).toBeNull();
            }
            else {
                expect(item.frontmatter).toBe(expectedFileWithFrontmatter!.frontmatter);
            }

            // Return value doesn't matter for this test
            return true;
        });
    });

    it('returns no files when there is no match with the query', async () => {
        // Arrange
        const mockInput = new MockInput([{ file: new TFile(), frontmatter: undefined }]);
        const mocks = new Mocks(mockInput);
        mocks.metadataCache.getFileCache = jest.fn(_ => null); // no metadata will be found
        const sut = getSut(mocks);

        // Act & Assert
        await queryFilesAsync(sut, item => {
            expect(item.frontmatter).toBeNull();
            return true;
        });
    });
});

function getSut(mocks: Mocks) {
    const app = new App();
    app.vault = mocks.vault;
    app.metadataCache = mocks.metadataCache;
    return app;
}

class Mocks {

    vault: Vault;
    metadataCache: MetadataCache;

    constructor(mockInput: MockInput) {
        this.vault = new Vault();
        this.metadataCache = new MetadataCache();
        this.setupDefaults(mockInput);
    }

    setupDefaults(mockInput: MockInput) {
        this.vault.getFiles = jest.fn().mockReturnValue(mockInput.files);
        this.metadataCache.getFileCache = jest.fn(file => {
            const frontmatter = mockInput.filesWithFrontMatter.find(x => x.file === file)?.frontmatter;
            return { frontmatter: frontmatter };
        });
    }
}

class MockInput {

    public get files() {
        return this.filesWithFrontMatter.map(f => f.file);
    }

    constructor(
        public filesWithFrontMatter: {file: TFile, frontmatter?: FrontMatterCache}[] = []
    ) { }
}