import { App, TFile } from "obsidian";
import getDailyNotesTemplateAsync from "./get_daily_notes_template_async";
import { Plugin, Plugins } from "@src/__mocks__/obsidian";

describe('getDailyNotesTemplate', () => {
    it('returns the content of the daily notes template when found', async () => {
        // Arrange
        const mockInput = new MockInput();
        mockInput.dailyNotesPlugin = new Plugin();
        mockInput.dailyNotesPlugin.instance = { options: { template: '/test/template' } };
        const mocks = new Mocks(mockInput);
        const spies = new Spies(mocks);
        
        // Act
        const dailyNotesTemplate = await getDailyNotesTemplateAsync(mocks.app);

        // Assert
        expect(dailyNotesTemplate).toBe(mockInput.templateContent);
        expect(spies.getPluginByIdSpy).toHaveBeenCalledTimes(1);
        expect(spies.getFileByPathSpy).toHaveBeenCalledTimes(1);
    });
    
    it('returns null if the plugin is disabled', async () => {
        // Arrange
        const mockInput = new MockInput();
        mockInput.dailyNotesPlugin = new Plugin();
        mockInput.dailyNotesPlugin.enabled = false;
        const mocks = new Mocks(mockInput);
        const spies = new Spies(mocks);
        
        // Act
        const dailyNotesTemplate = await getDailyNotesTemplateAsync(mocks.app);

        // Assert
        expect(dailyNotesTemplate).toBeNull();
        expect(spies.getPluginByIdSpy).toHaveBeenCalledTimes(1);
        expect(spies.getFileByPathSpy).toHaveBeenCalledTimes(0);
    });
    
    it('returns null if no daily notes template is defined', async () => {
        // Arrange
        const mockInput = new MockInput();
        mockInput.dailyNotesPlugin = new Plugin();
        const mocks = new Mocks(mockInput);
        const spies = new Spies(mocks);
        
        // Act
        const dailyNotesTemplate = await getDailyNotesTemplateAsync(mocks.app);

        // Assert
        expect(dailyNotesTemplate).toBeNull();
        expect(spies.getPluginByIdSpy).toHaveBeenCalledTimes(1);
        expect(spies.getFileByPathSpy).toHaveBeenCalledTimes(0);
    });
});

class Spies {
    getPluginByIdSpy: jest.SpyInstance;
    getFileByPathSpy: jest.SpyInstance;

    constructor(mocks: Mocks) {
        this.getPluginByIdSpy = jest.spyOn((mocks.app as any).internalPlugins, 'getPluginById');
        this.getFileByPathSpy = jest.spyOn(mocks.app.vault, 'getFileByPath');
    }
}

class Mocks {
    app: App;

    constructor(mockInput: MockInput) {
        const plugins = new Plugins();
        plugins.getPluginById = jest.fn(() => mockInput.dailyNotesPlugin);

        this.app = new App();
        (this.app as any).internalPlugins = plugins;
        this.app.vault.read = jest.fn(async () => mockInput.templateContent);
    }
}

class MockInput {
    dailyNotesPlugin?: Plugin;
    templateContent: string;

    constructor() {
        this.templateContent = "Test content";
    }
}