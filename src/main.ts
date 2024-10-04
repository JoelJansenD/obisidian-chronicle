import { Plugin } from 'obsidian';
import ChronicleView, { VIEW_TYPE } from 'tests/chronicle_view';

export default class ChroniclePlugin extends Plugin {

    async onload() {
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

    onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE);
    }

};