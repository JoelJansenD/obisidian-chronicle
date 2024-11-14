import DailyNotesPlugin from "./daily_notes_plugin";

export default function getDailyNotesPluginSettings(dailyNotesPlugin: DailyNotesPlugin) {
    return dailyNotesPlugin.instance.options;
}