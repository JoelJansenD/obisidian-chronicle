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
        requestAnimationFrame(() => {
            const container = this.containerEl.children[1];
            container.empty();
            const content = document.createElement('div');
            const width = this.containerEl.offsetWidth;

            const calendar = new Calendar({
                target: content,
                props: {
                    plugins: [ TimeGrid ],
                    options: {
                        allDayContent: { html: '' },
                        dayHeaderFormat: d => this.formatHeader(d, width),
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
        });
    }

    private formatHeader(date: Date, width: number) {
        const dayAbb = date.toLocaleDateString('nl', { weekday: 'long' });
        return {
            html: `<div class='cv-day'>
                       <span>${dayAbb[0].toUpperCase()}${(width > 768 ? dayAbb.substring(1) : '')}</span>
                       <span>${date.getDate()}</span>
                   </div>`
        };
    }

}