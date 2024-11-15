import { App, TFile, Vault } from "obsidian";
import getDailyNotesInTimespan from "./get_daily_notes_in_timespan";
import { Plugin, Plugins } from "@src/__mocks__/obsidian";
import moment from "moment";

describe('getDailyNotesInTimespan', () => {

    it('returns all files in daily directory between start and end', () => {
        // Arrange
        const startDate = new Date(2024,10,1, 12, 0, 0); // We specify hours here because we want a granularity of days, which is tested in this way
        const endDate = new Date(2024,11,1);
        const mockInput = new MockInput();
        mockInput.files = [
            { directory: '/', date: new Date(2024,10,12), format: 'YYYY-MM-DD' }, // Return, falls in range
            { directory: '/', date: startDate, format: 'YYYY-MM-DD' }, // Return, exact start
            { directory: '/', date: endDate, format: 'YYYY-MM-DD' }, // Return, exact end
            { directory: '/', date: new Date(2024, 1, 1), format: 'YYYY-MM-DD' }, // Too Early
            { directory: 'not-daily', date: new Date(2024,10,12), format: 'YYYY-MM-DD' }, // Wrong directory
            { directory: '/', date: new Date(2025,1,1), format: 'YYYY-MM-DD' }, // Too Late
            { directory: '/', date: new Date(2024,10,12), format: 'DD-MM-YYYY' }, // Wrong format
        ]
        const mocks = new Mocks(mockInput);

        // Act
        const result = getDailyNotesInTimespan(mocks.app, { start: startDate, end: endDate });

        // Assert
        expect(result).toHaveLength(3);
        for(let i = 0; i < 3; i++) {
            expect(result![i].basename).toBe(moment(mockInput.files[i].date).format(mockInput.files[i].format));
        }
    });
    
    it('returns all files in daily directory after start', () => {
        // Arrange
        const startDate = new Date(2024,10,1, 12, 0, 0); // We specify hours here because we want a granularity of days, which is tested in this way
        const mockInput = new MockInput();
        mockInput.files = [
            { directory: '/', date: new Date(2024,10,12), format: 'YYYY-MM-DD' }, // Return, falls in range
            { directory: '/', date: startDate, format: 'YYYY-MM-DD' }, // Return, exact start
            { directory: '/', date: new Date(2024, 1, 1), format: 'YYYY-MM-DD' }, // Too Early
        ]
        const mocks = new Mocks(mockInput);

        // Act
        const result = getDailyNotesInTimespan(mocks.app, { start: startDate });

        // Assert
        expect(result).toHaveLength(2);
        for(let i = 0; i < 2; i++) {
            expect(result![i].basename).toBe(moment(mockInput.files[i].date).format(mockInput.files[i].format));
        }
    });

    it('returns all files in daily directory before end', () => {
        // Arrange
        const endDate = new Date(2024,11,1,12,0,0); // We specify hours here because we want a granularity of days, which is tested in this way
        const mockInput = new MockInput();
        mockInput.files = [
            { directory: '/', date: new Date(2024,10,12), format: 'YYYY-MM-DD' }, // Return, falls in range
            { directory: '/', date: endDate, format: 'YYYY-MM-DD' }, // Return, exact end
            { directory: '/', date: new Date(2025,1,1), format: 'YYYY-MM-DD' }, // Too Late
        ]
        const mocks = new Mocks(mockInput);

        // Act
        const result = getDailyNotesInTimespan(mocks.app, { end: endDate });

        // Assert
        expect(result).toHaveLength(2);
        for(let i = 0; i < 2; i++) {
            expect(result![i].basename).toBe(moment(mockInput.files[i].date).format(mockInput.files[i].format));
        }
    });

    it('uses YYYY-MM-DD when no format is configured', () => {
        // Arrange
        const startDate = new Date(2024,10,1, 12, 0, 0); // We specify hours here because we want a granularity of days, which is tested in this way
        const endDate = new Date(2024,11,1);
        const mockInput = new MockInput();
        mockInput.plugin!.instance.options.format = undefined;
        mockInput.files = [
            { directory: '/', date: new Date(2024,10,12), format: 'YYYY-MM-DD' }, // Return, falls in range
            { directory: '/', date: new Date(2024,10,12), format: 'DD-MM-YYYY' }, // Not found, different format
        ]
        const mocks = new Mocks(mockInput);

        // Act
        const result = getDailyNotesInTimespan(mocks.app, { start: startDate, end: endDate });

        // Assert
        expect(result).toHaveLength(1);
    });

    test.each([[undefined], ['']])('uses "/" when no folder is configured or folder is empty', (folder?: string) => {
        // Arrange
        const startDate = new Date(2024,10,1, 12, 0, 0); // We specify hours here because we want a granularity of days, which is tested in this way
        const endDate = new Date(2024,11,1);
        const mockInput = new MockInput();
        mockInput.plugin!.instance.options.folder = folder;
        mockInput.files = [
            { directory: '/', date: new Date(2024,10,12), format: 'YYYY-MM-DD' }, // Return, falls in range
            { directory: '', date: new Date(2024,10,12), format: 'YYYY-MM-DD' }, // Not found, different folder
        ]
        const mocks = new Mocks(mockInput);

        // Act
        const result = getDailyNotesInTimespan(mocks.app, { start: startDate, end: endDate });

        // Assert
        expect(result).toHaveLength(1);
    });
    
    it('does not return files without parents', () => {
        // Arrange
        const startDate = new Date(2024,10,1, 12, 0, 0); // We specify hours here because we want a granularity of days, which is tested in this way
        const endDate = new Date(2024,11,1);
        const mockInput = new MockInput();
        const mocks = new Mocks(mockInput);
        const orphanedFile: TFile = {
            basename: moment(startDate).format('YYYY-MM-DD'),
            extension: '.md',
            name: '',
            parent: null,
            path: '/',
            stat: { ctime: 1, mtime: 1, size: 1 },
            vault: mocks.app.vault
        };
        mocks.app.vault.getFiles = jest.fn(() => [ orphanedFile ]);

        // Act
        const result = getDailyNotesInTimespan(mocks.app, { start: startDate, end: endDate });

        // Assert
        expect(result).toHaveLength(0);
    });
    
    it('does not return files that are not parsable', () => {
        // Arrange
        const startDate = new Date(2024,10,1, 12, 0, 0); // We specify hours here because we want a granularity of days, which is tested in this way
        const endDate = new Date(2024,11,1);
        const mockInput = new MockInput();
        const mocks = new Mocks(mockInput);
        const orphanedFile: TFile = {
            basename: 'invalid file name',
            extension: '.md',
            name: '',
            parent: { children: [], isRoot: () => true, name: '', parent: null, path: '/', vault: mocks.app.vault },
            path: '/',
            stat: { ctime: 1, mtime: 1, size: 1 },
            vault: mocks.app.vault
        };
        mocks.app.vault.getFiles = jest.fn(() => [ orphanedFile ]);

        // Act
        const result = getDailyNotesInTimespan(mocks.app, { start: startDate, end: endDate });

        // Assert
        expect(result).toHaveLength(0);
    });

    test.each([[true], [false]])('returns null if the daily notes plugin is null or disabled', (pluginIsNull: boolean) => {
        // Arrange
        const mockInput = new MockInput();
        if(pluginIsNull) {
            mockInput.plugin = null;
        }
        else {
            mockInput.plugin!.enabled = false;
        }
        const mocks = new Mocks(mockInput);

        // Act
        const notes = getDailyNotesInTimespan(mocks.app, { start: new Date() });

        // Assert
        expect(notes).toBeNull();
    });

    it('throws when no start or end dates are specified', () => {
        // Arrange
        const app = new App();

        // Act & Assert
        expect(() => getDailyNotesInTimespan(app, {})).toThrow('The dates object needs at least one of start or end');
    });
});

class Mocks {
    app: App;

    constructor(mockInput: MockInput) {
        const plugins = new Plugins();
        plugins.getPluginById = jest.fn(() => mockInput.plugin);

        this.app = new App();
        (this.app as any).internalPlugins = plugins;
        this.app.vault.getFiles = jest.fn(() => mockInput.files.map(f => createFileForDate(f.directory, f.date, f.format, this.app.vault)));
    }
}

class MockInput {
    files: { directory: string, date: Date, format: string }[] = [];
    plugin: Plugin | null;

    constructor() {
        this.plugin = {
            enabled: true,
            instance: {
                options: {
                    format: 'YYYY-MM-DD',
                    folder: '/',
                }
            },
            loadData: jest.fn()
        };
    }
}

function createFileForDate(directory: string, date: Date, format: string, vault: Vault) : TFile {
    const noteMoment = moment(date);
    const baseName = noteMoment.format(format);
    return {
        basename: baseName,
        extension: '.md',
        name: `${baseName}.md`,
        parent: { children:[], name: '', parent: null, path: directory, vault, isRoot: () => true },
        path: directory,
        stat: { ctime: 1, mtime: 1, size: 1 },
        vault
    };
}