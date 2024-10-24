import { App, Plugin, PluginManifest } from 'obsidian';
import ObsidianChronicleView, { CHRONICLE_VIEW_TYPE } from './view/obsidian_chronicle_view';
import ChronicleCache from './cache/chronicle_cache';
import NoteDataAccess from './data_access/note_data_access';

export default class ChroniclePlugin extends Plugin {

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

    onunload() {
        this.app.workspace.detachLeavesOfType(CHRONICLE_VIEW_TYPE);
    }

};