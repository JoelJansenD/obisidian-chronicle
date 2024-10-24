import { ItemView, WorkspaceLeaf } from "obsidian";
import { renderCalendar } from './calendar';
import { Calendar, DateSelectArg, DatesSetArg, EventApi, EventClickArg, EventHoveringArg, EventInput } from "@fullcalendar/core";
import NewTaskModal from "./new_task_modal";
import ChroniclePlugin from "@src/main";

export const CHRONICLE_VIEW_TYPE = 'full-calendar-view';
export default class ObsidianChronicleView extends ItemView {

    private fullCalendar: Calendar | null;
    private readonly _plugin: ChroniclePlugin;

    constructor(leaf: WorkspaceLeaf, plugin: ChroniclePlugin) {
        super(leaf);
        this._plugin = plugin;
    }

    datesSet(dateInfo: DatesSetArg) {
        // We have to remove all events, otherwise switching back and forth
        // repeatedly adds the same events to the calendar
        dateInfo.view.calendar.removeAllEvents();
        const displayedNotes = this._plugin.noteDataAccess.getFilesInDirectoryWithMetadata('', (item) => {
            const dateOrNull = (dt?: string) => dt ? new Date(dt) : null;
            const startTime = dateOrNull(item['start']);
            const endTime = dateOrNull(item['end']);

            if(!startTime || !endTime) {
                return false;
            }

            if(startTime > dateInfo.end) {
                return false;
            }

            if(endTime < dateInfo.start) {
                return false;
            }

            return true;
        });

        for (let i = 0; i < displayedNotes.length; i++) {
            const note = displayedNotes[i];
            const event: EventInput = {
                title: note.file.name,
                start: note.metadata['start'],
                end: note.metadata['end'],
                allDay: false
            };
            dateInfo.view.calendar.addEvent(event);
        }
    }

    // Calendar events
    eventClick(event: EventClickArg) {
        console.log('eventClick')
        console.log(event)
    }

    async eventMouseEnter(event: EventHoveringArg) {
        console.log('eventMouseEnter')
        console.log(event)
    }
    
    async modifyEvent(newEvent: EventApi, oldEvent: EventApi) {
        console.log('modifyEvent')
        console.log(newEvent)
        console.log(oldEvent)
        return false;
    }

    async openContextMenuForEvent(e: EventApi, mouseEvent: MouseEvent) {
        console.log('openContextMenuForEvent')
        console.log(e)
        console.log(mouseEvent)
    }

    async select(args: DateSelectArg) {
        const modal = new NewTaskModal(this.app, { 
            start: args.start, 
            end: args.end,
            onSaveAsync: async (result) => {
                if(!result.title) {
                    return false;
                }

                const event: EventInput = {
                    title: result.title,
                    start: args.start,
                    end: args.end,
                    allDay: args.allDay
                };
                args.view.calendar.addEvent(event);

                let content = `---
start: ${ args.start.toISOString() }
end: ${args.end.toISOString() }
---`;

                await this.app.vault.create(`${result.title}.md`, content);
                return true;
            }
        });
        modal.open();

    }

    async toggleTask(e: EventApi, isDone: boolean) {
        console.log('toggleTask')
        console.log(e)
        console.log(isDone)
        return false;
    }

    // ItemView implementations
    getViewType(): string {
        return CHRONICLE_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Calendar';
    }

    getIcon() {
        return 'calendar';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();

        const containerElement = container.createDiv();

        this.fullCalendar?.destroy();
        this.fullCalendar = null;

        this.fullCalendar = renderCalendar(containerElement, [], {
            // Properties
            firstDay: 0,
            initialView: { desktop: 'dayGridWeek',  mobile: 'dayGridWeek' },

            // Events
            // Instead of passing the methods as events, we have to call them to ensure that we still have access to Obsidian's API
            datesSet: args => this.datesSet(args),
            eventClick: this.eventClick,
            eventMouseEnter: this.eventMouseEnter,
            modifyEvent: this.modifyEvent,
            openContextMenuForEvent: this.openContextMenuForEvent,
            select: args => this.select(args),
            toggleTask: this.toggleTask
        });

        // @ts-ignore
        window.fc = this.fullCalendar;

        this.registerDomEvent(this.containerEl, 'mouseenter', () => {
            console.log('mouseenter');
        });
    }

    onResize(): void {
        this.fullCalendar?.render();
    }

    async onUnload() {
        this.fullCalendar?.destroy();
        this.fullCalendar = null;
    }

}