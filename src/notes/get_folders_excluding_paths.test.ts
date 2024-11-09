import { TFolder, Vault } from "obsidian";
import getFoldersExcludingPaths from "./get_folders_excluding_paths";

describe('getFoldersExcludingPaths', () => {

    let vault: Vault;
    beforeEach(() => {
        vault = new Vault();

        const folders = [ new TFolder(), new TFolder(), new TFolder() ];
        folders[0].path = 'first-path';
        folders[1].path = 'second-path';
        folders[2].path = 'third-path';
        vault.getAllFolders = jest.fn(() => folders);
    });

    it('returns all folders that are not excluded', () => {
        // Arrange
        const excluded = [ 'second-path' ];

        // Act
        const result = getFoldersExcludingPaths(vault, excluded);

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0].path).toBe('first-path');
        expect(result[1].path).toBe('third-path');
    });

    it('returns an empty array when all folders are excluded', () => {
        // Arrange
        const excluded = [ 'first-path', 'second-path', 'third-path' ];

        // Act
        const result = getFoldersExcludingPaths(vault, excluded);

        // Assert
        expect(result).toHaveLength(0);
    });
});