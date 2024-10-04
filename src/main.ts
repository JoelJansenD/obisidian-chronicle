import { Plugin } from 'obsidian';
import ChronicleView, { VIEW_TYPE } from './chronicle_view';

export default class ChroniclePlugin extends Plugin {

    async onload() {
        // this.loadCss('main.css');

        this.registerView(VIEW_TYPE, leaf => new ChronicleView(leaf));
        
        this.addRibbonIcon(
            'calendar',
            'Open chronicle',
            async () => {
                await this.activateView();
            }
        );
    }

    async activateView() {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
        if(leaves.length === 0) {
            const leaf = this.app.workspace.getLeaf(false);
            await leaf.setViewState({
                type: VIEW_TYPE,
                active: true
            });
        }
        else {
            this.app.workspace.revealLeaf(leaves[0]);
        }
    }

    loadCss(fileName: string) {
        const linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.type = 'text/css';
        linkEl.href = this.getAssetUrl(fileName);
        document.head.appendChild(linkEl);
    }

    getAssetUrl(name: string) {
        return this.app.vault.adapter.getResourcePath(`${this.manifest.dir}/${name}`);
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE);
    }

};