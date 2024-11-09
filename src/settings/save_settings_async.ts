import ChroniclePlugin from "@src/main";
import { ChronicleSettings } from "./obsidian_chronicle_settings";

export default async function saveSettingsAsync(plugin: ChroniclePlugin, settings: ChronicleSettings) {
    plugin.saveData(settings);
}