import { ChronicleSettings } from './obsidian_chronicle_settings';

const DEFAULT_SETTINGS : ChronicleSettings = {
    calendars: [ ]
}

export type ObsidianApp = {
    loadData(): Promise<any>;
    saveData(data: any): Promise<void>;
}

export interface ISettingsService { 
    loadSettingsAsync(): Promise<ChronicleSettings>;
    saveSettingsAsync(settings: ChronicleSettings): Promise<void>;
}

export default class SettingsService implements ISettingsService {
    private readonly _app: ObsidianApp;

    constructor(app: ObsidianApp) {    
        this._app = app;    
    }

    async loadSettingsAsync(): Promise<ChronicleSettings> {
        const settings = Object.assign({}, DEFAULT_SETTINGS, await this._app.loadData());
        return settings;
    }

    async saveSettingsAsync(settings: ChronicleSettings) {
        this._app.saveData(settings);
    }
}