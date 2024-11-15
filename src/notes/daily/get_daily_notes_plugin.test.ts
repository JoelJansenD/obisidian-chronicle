import { App } from "obsidian";
import getDailyNotesPlugin from "./get_daily_notes_plugin";
import { Plugins } from "@src/__mocks__/obsidian";

describe('getDailyNotesPlugin', () => {
    it('returns the plugin when found', () => {
        // Arrange
        const app = new App();
        const plugins = new Plugins();
        plugins.getPluginById = jest.fn(() => ({  }));
        (app as any).internalPlugins = plugins;

        // Act
        const result = getDailyNotesPlugin(app);

        // Assert
        expect(result).not.toBeNull()
    });
    
    it('returns null when not found', () => {
        // Arrange
        const app = new App();

        // Act
        const result = getDailyNotesPlugin(app);

        // Assert
        expect(result).toBeNull()
    });
});