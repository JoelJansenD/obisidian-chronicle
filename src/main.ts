import { App, Plugin, PluginManifest } from 'obsidian';
import ObsidianChronicleView, { CHRONICLE_VIEW_TYPE } from './view/obsidian_chronicle_view';
import ChronicleCache from './cache/chronicle_cache';
import NoteDataAccess from './data_access/note_data_access';
import ObsidianChronicleSettings, { DEFAULT_SETTINGS } from './settings/obsidian_chronicle_settings';
import ObsidianChronicleSettingsTab from './settings/obsidian_chronicle_settings_tab';

export default class ChroniclePlugin extends Plugin {

    private _settings: ObsidianChronicleSettings;
    public get settings() {
        return this._settings;
    }

    private readonly _cache: ChronicleCache;
    public get cache() {
        return this._cache;
    }
    private readonly _noteDataAccess: NoteDataAccess;
    public get noteDataAccess() {
        return this._noteDataAccess;
    }
    
    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        
        this._cache = new ChronicleCache();
        this._noteDataAccess = new NoteDataAccess(app);
    }

    async onload() {
        // Add settings and settings view
        await this.loadSettings();
        this.addSettingTab(new ObsidianChronicleSettingsTab(this.app, this));

        // Add view and tab icon
        this.registerView(CHRONICLE_VIEW_TYPE, leaf => new ObsidianChronicleView(leaf, this));        
        this.addRibbonIcon(
            'calendar',
            'Open chronicle',
            async () => {
                await this.activateView();
            }
        );
    }

    async activateView() {
        const leaves = this.app.workspace.getLeavesOfType(CHRONICLE_VIEW_TYPE);
        if(leaves.length === 0) {
            const leaf = this.app.workspace.getLeaf(false);
            await leaf.setViewState({
                type: CHRONICLE_VIEW_TYPE,
                active: true
            });
        }
        else {
            this.app.workspace.revealLeaf(leaves[0]);
        }
    }

    getAssetUrl(name: string) {
        return this.app.vault.adapter.getResourcePath(`${this.manifest.dir}/${name}`);
    }

    async loadSettings() {
        this._settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(CHRONICLE_VIEW_TYPE);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

};