import { ItemView, WorkspaceLeaf } from "obsidian";
import { renderCalendar } from './calendar';
import { Calendar, DateSelectArg, EventApi, EventClickArg, EventHoveringArg, EventInput } from "@fullcalendar/core";
import NewTaskModal from "./new_task_modal";

export const CHRONICLE_VIEW_TYPE = 'full-calendar-view';
export default class ObsidianChronicleView extends ItemView {

    private fullCalendar: Calendar | null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
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
        const event: EventInput = {
            title: 'Lorem Ipsum',
            start: args.start,
            end: args.end,
            allDay: args.allDay
        };
        args.view.calendar.addEvent(event);

        const modal = new NewTaskModal(this.app);
        modal.open();

        await this.app.vault.create(`Lorem Ipsum.md`, 'Dolor sit amet');
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