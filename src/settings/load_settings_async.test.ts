import ChroniclePlugin from "../main";
import { App, PluginManifest } from "obsidian";
import TestManifest from '../__mocks__/test_manifest';
import loadSettingsAsync from "./load_settings_async";
import DEFAULT_SETTINGS from "./default_settings";
import { ChronicleSettings } from "./obsidian_chronicle_settings";

describe('loadSettingsAsync', () => {
    
    it('creates a new default settings object if no settings exist', async () => {
        // Arrange
        const mockInput = new MockInput();
        const mocks = new Mocks(mockInput);

        // Act
        const result = await loadSettingsAsync(mocks.plugin);

        // Assert
        expect(result).toStrictEqual(DEFAULT_SETTINGS);
    });
    
    it('returns the existing settings object', async () => {
        // Arrange
        const mockInput = new MockInput();
        mockInput.settings = {
            calendars: [ { id: 'aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'test', colour: '#ffffff', directory: '' } ]
        };
        const mocks = new Mocks(mockInput);

        // Act
        const result = await loadSettingsAsync(mocks.plugin);

        // Assert
        expect(result).toStrictEqual(mockInput.settings);
    });

});

class Mocks {
    plugin: ChroniclePlugin;

    constructor(mockInput: MockInput) {
        const app = new App();
        const manifest = TestManifest;

        this.plugin = new ChroniclePlugin(app, manifest);
        this.plugin.loadData = jest.fn(() => Promise.resolve(mockInput.settings));
    }
}

class MockInput {
    constructor(public settings?: ChronicleSettings) { }
}