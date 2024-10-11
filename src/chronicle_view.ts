import { ItemView, WorkspaceLeaf } from 'obsidian';
import EventCalender from './calendar/event_calendar';
import FullCalendar from './calendar/full_calendar';

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
            const calendar = new FullCalendar();
            // const calendar = new EventCalendar();
            container.appendChild(calendar.container);
            calendar.calendar.render();
        });
    }

    

}