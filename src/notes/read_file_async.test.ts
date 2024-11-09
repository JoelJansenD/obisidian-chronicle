import { App, TFile } from "obsidian";
import readFileAsync from "./read_file_async";

describe('readFileAsync', () => {

    let app: App;

    beforeEach(() => {
        app = new App();
    });

    it('reads file from vault', async () => {
        // Arrange
        const file = new TFile();
        const readFileSpy = jest.spyOn(app.vault, 'read');

        // Act
        await readFileAsync(app, file);

        // Assert
        expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
});