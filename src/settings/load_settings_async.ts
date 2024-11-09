import ChroniclePlugin from "@src/main";
import DEFAULT_SETTINGS from "./default_settings";
import { ChronicleSettings } from "./obsidian_chronicle_settings";

export default async function loadSettingsAsync(plugin: ChroniclePlugin): Promise<ChronicleSettings> {
    const settings = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
    return settings;
}