import { App, Plugin, PluginManifest } from 'obsidian';
import ChronicleView, { CHRONICLE_VIEW_TYPE } from './view/chronicle_view';
import { ChronicleSettings } from './settings/chronicle_settings';
import ChronicleSettingsTab from './settings/chronicle_settings_tab';
import loadSettingsAsync from './settings/load_settings_async';

export default class ChroniclePlugin extends Plugin {

    private _settings: ChronicleSettings;
    public get settings() {
        return this._settings;
    }

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
    }

    async onload() {
        // Add settings and settings view
        await this.loadSettings();
        this.addSettingTab(new ChronicleSettingsTab(this.app, this));

        // Add view and tab icon
        this.registerView(CHRONICLE_VIEW_TYPE, leaf => new ChronicleView(leaf, this));        
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
        this._settings = await loadSettingsAsync(this);
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(CHRONICLE_VIEW_TYPE);
    }

    async saveSettings() {
        await this.saveData(this._settings);
    }

};