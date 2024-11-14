import { App } from "obsidian";
import DailyNotesPlugin from "./daily_notes_plugin";

export default function getDailyNotesPlugin(app: App) : DailyNotesPlugin | null {
    const plugins = (app as any).internalPlugins;
    return plugins.getPluginById('daily-notes') ?? null;
}