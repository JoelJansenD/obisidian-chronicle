import { App, TFile } from "obsidian";
import getFiles from "./get_files";

describe('getFiles', () => {
    let app: App;

    beforeEach(() => {
        app = new App();
    });

    it('returns all files in the vault', () => {
        // Arrange
        app.vault.getFiles = jest.fn().mockReturnValue([ new TFile(), new TFile() ]);
        const getFilesSpy = jest.spyOn(app.vault, 'getFiles');

        // Act
        const result = getFiles(app);

        // Assert
        expect(getFilesSpy).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(2);
    });
    
    it('returns no files when the vault is empty', () => {
        // Arrange
        app.vault.getFiles = jest.fn().mockReturnValue([]);
        const getFilesSpy = jest.spyOn(app.vault, 'getFiles');

        // Act
        const result = getFiles(app);

        // Assert
        expect(getFilesSpy).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(0);
    });
});