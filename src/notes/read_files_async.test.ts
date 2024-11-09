import { App, TFile } from "obsidian";
import readFilesAsync from "./read_files_async";

describe('readFilesAsync', () => {
    let app: App;

    beforeEach(() => {
        app = new App();
    });

    it('reads and returns content for all files', async () => {
        // Arrange
        const filesWithContent = [ {file: new TFile(), content: 'File 1'}, {file: new TFile(), content: 'File 2'} ];
        app.vault.read = jest.fn(file => {
            const fileWithContent = filesWithContent.find(x => x.file === file)!;
            return Promise.resolve(fileWithContent.content);
        });
        const input = filesWithContent.map(x => x.file);

        // Act
        const result = await readFilesAsync(app, input);

        // Assert
        expect(result).toHaveLength(input.length);
        expect(result[0].content).toBe(filesWithContent[0].content);
        expect(result[1].content).toBe(filesWithContent[1].content);
    });
});