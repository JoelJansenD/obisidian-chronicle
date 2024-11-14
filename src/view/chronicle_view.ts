import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import { renderCalendar } from './calendar';
import { Calendar, DateSelectArg, DatesSetArg, EventApi, EventClickArg, EventHoveringArg, EventInput } from "@fullcalendar/core";
import NewEventModal, { NewTaskModalResult } from "./new_event_modal";
import ChroniclePlugin from "@src/main";
import { replaceLastOccurance } from "@src/utils/string_utils";
import { createEvent } from "@src/events/events";
import { getCalendarById } from "@src/calendars/get_calendar_by_id";
import queryFilesAsync, { QueryFilesInput } from "@src/notes/query_files_async";
import getNotesBetweenDatesQuery from "@src/queries/get_notes_between_dates_query";
import { ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";

export const CHRONICLE_VIEW_TYPE = 'obsidia-chronicle-view';
export default class ChronicleView extends ItemView {

    private fullCalendar: Calendar | null;
    private readonly _plugin: ChroniclePlugin;

    constructor(leaf: WorkspaceLeaf, plugin: ChroniclePlugin) {
        super(leaf);
        this._plugin = plugin;
    }

    async datesSetAsync(dateInfo: DatesSetArg) {
        // We have to remove all events, otherwise switching back and forth
        // repeatedly adds the same events to the calendar
        dateInfo.view.calendar.removeAllEvents();
        const displayedNotes = await queryFilesAsync(
            this.app, 
            item => getNotesBetweenDatesQuery(item, dateInfo.start, dateInfo.end));

        for (let i = 0; i < displayedNotes.length; i++) {
            const note = displayedNotes[i];
            const calendarId = note.frontmatter!['calendarId'] as string;
            const calendar = getCalendarById(this._plugin.settings, calendarId);
            createEvent(dateInfo.view.calendar, {
                title: replaceLastOccurance(note.file.name, '.md', ''),
                start: note.frontmatter!['start'],
                end: note.frontmatter!['end'],
                allDay: false,
                backgroundColor: calendar?.colour,
                borderColor: calendar?.colour,
            });
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

    async onDateSavedAsync(result: NewTaskModalResult, args: DateSelectArg) {
        if(!result.title) {
            return false;
        }

        const event: EventInput = {
            title: result.title,
            start: args.start,
            end: args.end,
            allDay: args.allDay,
            backgroundColor: result.calendar.colour,
            borderColor: result.calendar.colour
        };
        createEvent(args.view.calendar, event);

        let content = `---
calendarId: ${ result.calendar.id }
start: ${ args.start.toISOString() }
end: ${args.end.toISOString() }
---`;
        await this.app.vault.create(`${(result.calendar as ChronicleFullCalendar).directory}/${result.title}.md`, content);
        return true;
    }

    async openContextMenuForEvent(e: EventApi, mouseEvent: MouseEvent) {
        console.log('openContextMenuForEvent')
        console.log(e)
        console.log(mouseEvent)
    }

    async select(args: DateSelectArg) {
        try {
            const modal = new NewEventModal(this.app, this._plugin, { 
                start: args.start, 
                end: args.end,
                onSaveAsync: async (result) => await this.onDateSavedAsync(result, args)
            });
            modal.open();
        }
        catch(e) {
            new Notice(e);
        }
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
            datesSet: args => this.datesSetAsync(args),
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