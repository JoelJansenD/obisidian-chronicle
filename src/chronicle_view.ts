import { IconName, ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE = 'chronicle-view';

export default class ChronicleView extends ItemView {

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'display text';
    }

    getIcon() {
        return 'calendar';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        const content = document.createElement('div');
        content.textContent = 'Content biatch';
        container.appendChild(content);
    }

}