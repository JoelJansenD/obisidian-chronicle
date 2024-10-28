import DEFAULT_SETTINGS from "./default_settings";
import { ChronicleSettings } from "./obsidian_chronicle_settings";

export default async function loadSettingsAsync(): Promise<ChronicleSettings> {
    const settings = Object.assign({}, DEFAULT_SETTINGS, await this._app.loadData());
    return settings;
}