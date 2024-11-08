import { App, TFile } from "obsidian";
import getFiles from "./get_files";

describe('getFiles', () => {
    it('returns all files in the vault', () => {
        // Arrange
        const app = new App();
        app.vault.getFiles = jest.fn().mockReturnValue([ new TFile(), new TFile() ]);
        const getFilesSpy = jest.spyOn(app.vault, 'getFiles');

        // Act
        const files = getFiles(app);

        // Assert
        expect(getFilesSpy).toHaveBeenCalledTimes(1);
        expect(files).toHaveLength(2);
    });
});