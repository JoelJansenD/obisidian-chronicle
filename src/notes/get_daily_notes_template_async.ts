import { App } from "obsidian";
import readFileAsync from "./read_file_async";

export default async function getDailyNotesTemplateAsync(app: App) {
    // We have to cast App as any because the TS type doesn't have access to the App's plugin system
    const plugins = (app as any).internalPlugins;
    const dailyNotesPlugin = plugins.getPluginById('daily-notes');
    const dailyNotesPluginSettings = dailyNotesPlugin.instance.options;
    if(!dailyNotesPlugin.enabled) {
        return null;
    }

    const dailyNoteTemplatePath = dailyNotesPluginSettings.template;
    if(!dailyNoteTemplatePath) {
        return null;
    }

    const templateFile = app.vault.getFileByPath(`${dailyNoteTemplatePath}.md`);
    return await readFileAsync(app, templateFile!);
}