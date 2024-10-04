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
                    allDayContent: { html: '' },
                    dayHeaderFormat: this.formatHeader,
                    events: [],
                    locale: 'nl',
                    nowIndicator: true,
                    slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
                    titleFormat: d => {
                        const month = d.toLocaleDateString('nl', { month: 'long' });
                        return `${month[0].toUpperCase()}${month.substring(1)}`
                    },
                    view: 'timeGridWeek',
                }
            }
        });

        container.appendChild(content);
    }

    private formatHeader(date: Date) {
        const dayAbb = date.toLocaleDateString('nl', { weekday: 'long' });
        return {
            html: `<div style="display: flex;flex-direction: column;margin:0px 0px 8px 0px;">
                       <span style="font-size: 12px;">${dayAbb[0].toUpperCase()}${dayAbb.substring(1)}</span>
                       <span style="font-size: 32px;">${date.getDate()}</span>
                   </div>`
        };
    }

}