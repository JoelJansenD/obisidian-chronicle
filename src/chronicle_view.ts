import { ItemView, WorkspaceLeaf } from 'obsidian';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import '@event-calendar/core/index.css';

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

        const calendar = new Calendar({
            target: content,
            props: {
                plugins: [ TimeGrid ],
                options: {
                    view: 'timeGridWeek',
                    events: [],
                    locale: 'nl'
                }
            }
        });

        container.appendChild(content);
    }

}