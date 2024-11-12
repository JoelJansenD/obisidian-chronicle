import { App } from "obsidian";
import readFileAsync from "./read_file_async";

export default async function getDailyNotesTemplateAsync(app: App) {
    // We have to case App as any because the TS type doesn't have access to the App's plugin system
    const plugins = (app as any).internalPlugins;
    console.log(plugins);
    const dailyNotesPlugin = plugins.getPluginById('daily-notes');
    console.log(dailyNotesPlugin);
    const dailyNotesPluginSettings = dailyNotesPlugin.instance.options;
    console.log(dailyNotesPluginSettings);
    const dailyNoteTemplatePath = dailyNotesPluginSettings.template;
    console.log(dailyNoteTemplatePath);


    const files = app.vault.getFiles();
    console.log(files)
    const templateFile = app.vault.getFileByPath(`${dailyNoteTemplatePath}.md`);
    console.log(templateFile);
    const templateContent = await readFileAsync(app, templateFile!);
    console.log(templateContent)
}