import { ChronicleSettings } from "./obsidian_chronicle_settings";

export default async function saveSettingsAsync(settings: ChronicleSettings) {
    this._app.saveData(settings);
}