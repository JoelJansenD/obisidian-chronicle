import { App } from "obsidian";
import readFileAsync from "../read_file_async";
import getDailyNotesPlugin from "./get_daily_notes_plugin";

export default async function getDailyNotesTemplateAsync(app: App) {
    // We have to cast App as any because the TS type doesn't have access to the App's plugin system
    const dailyNotesPlugin = getDailyNotesPlugin(app);
    if(!dailyNotesPlugin?.enabled) {
        return null;
    }

    const dailyNotesPluginSettings = dailyNotesPlugin.instance.options;
    const dailyNoteTemplatePath = dailyNotesPluginSettings.template;
    if(!dailyNoteTemplatePath) {
        return null;
    }

    const templateFile = app.vault.getFileByPath(`${dailyNoteTemplatePath}.md`);
    return await readFileAsync(app, templateFile!);
}